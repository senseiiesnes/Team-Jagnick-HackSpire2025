import os
import logging
import sys
from typing import Dict, List, Optional, Any

# --- FastAPI & Related ---
from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
import uvicorn

# --- Import Logic from chatbot_logic ---
# Import the initialization function and specific logic functions needed
from chatbot_logic import (
    initialize_dependencies,
    detect_emotion_percentages,
    get_significant_emotions,
    generate_followup_question,
    generate_recommendations,
    MAX_CHAT_ROUNDS # Import constants if needed
)

# --- Logging Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# === Global Variables for FastAPI App ===
# These hold the initialized objects accessible within API calls
llm: Optional[Any] = None
sp: Optional[Any] = None # Using Any for sp since spotipy type hints might require explicit install

# In-memory store for conversation state {user_id: state}
# **NOTE:** This state is lost when the server restarts. Use a persistent store for production.
conversations: Dict[str, Dict[str, Any]] = {}

# === FastAPI App Setup ===
app = FastAPI(
    title="Mood Aware Chatbot API",
    version="1.1.0", # Incremented version
    description="API to interact with a mood-aware chatbot, providing chat responses and recommendations."
)

def lifespan(app):
    async def startup_event():
        """Initialize LLM and Spotify client at startup by calling the function from chatbot_logic."""
        global llm, sp
        logging.info("FastAPI Startup: Initializing dependencies...")
        llm, sp = initialize_dependencies() # Call the function from the logic file
        if not llm:
            logging.warning("LLM initialization failed. API will run with limited functionality.")
            # Depending on requirements, you might stop the app:
            # raise RuntimeError("LLM failed to initialize. Cannot start API.")
        if not sp:
            logging.warning("Spotify initialization failed or skipped. Recommendation features might be limited.")

    async def shutdown_event():
        logging.info("FastAPI Shutdown: Clearing in-memory conversation state.")
        global conversations
        conversations.clear()
        # Add any other cleanup if necessary

    return startup_event, shutdown_event

app.add_event_handler("startup", lifespan(app)[0])
app.add_event_handler("shutdown", lifespan(app)[1])


# === API Models (Pydantic) ===
class ChatMessageInput(BaseModel):
    user_id: str
    text: str
    user_name: Optional[str] = "Friend"

class RecommendationOutput(BaseModel):
    movies: List[str]
    books: List[str]
    songs: List[str]
    music_category: str

class ChatResponse(BaseModel):
    user_id: str
    assistant_message: str
    conversation_ended: bool = False
    feeling_better_acknowledged: bool = False
    recommendations: Optional[RecommendationOutput] = None
    current_significant_emotions: Optional[List[str]] = None

# === API Endpoint ===
@app.post("/chat/message",
          response_model=ChatResponse,
          summary="Send a message to the chatbot",
          description="Handles user messages, manages conversation state, and returns chatbot responses or recommendations.",
          tags=["Chat"]
         )
async def handle_chat_message(message_input: ChatMessageInput = Body(...)):
    """
    Main endpoint for chat interaction.
    Requires user_id and text. Manages conversation state in memory.
    """
    user_id = message_input.user_id
    user_text = message_input.text
    user_name = message_input.user_name

    # Access initialized LLM and SP clients from globals
    global llm, sp

    if not llm:
         raise HTTPException(status_code=503, detail="Chatbot LLM is currently unavailable. Please try again later.")

    # --- Get or Initialize Conversation State ---
    if user_id not in conversations:
        logging.info(f"Starting new conversation for user_id: {user_id}")
        try:
            # Call functions from chatbot_logic, passing llm/sp
            emotion_scores = detect_emotion_percentages(user_text, llm=llm)
            significant_emotions = get_significant_emotions(emotion_scores)
        except Exception as e:
             logging.error(f"Initial mood analysis failed for user {user_id}: {e}")
             raise HTTPException(status_code=500, detail="Failed to analyze initial mood.")

        conversations[user_id] = {
            "history": [{"role": "user", "content": user_text}],
            "initial_significant_emotions": significant_emotions.copy(),
            "current_significant_emotions": significant_emotions.copy(),
            "emotion_scores": emotion_scores.copy(),
            "rounds": 0,
            "name": user_name,
            "feeling_better_flag": False
        }
        state = conversations[user_id]

        try:
             assistant_reply = generate_followup_question(state["current_significant_emotions"], state["history"], llm=llm)
        except Exception as e:
             logging.error(f"Follow-up question generation failed for user {user_id}: {e}")
             raise HTTPException(status_code=500, detail="Failed to generate chat response.")

        state["history"].append({"role": "assistant", "content": assistant_reply})

        return ChatResponse(
            user_id=user_id,
            assistant_message=assistant_reply,
            conversation_ended=False,
            current_significant_emotions=state["current_significant_emotions"]
        )

    else:
        # --- Subsequent message ---
        state = conversations[user_id]
        logging.info(f"Continuing conversation for user_id: {user_id}, round: {state['rounds']}")
        state["history"].append({"role": "user", "content": user_text})
        state["rounds"] += 1

        # --- Check for End Conditions ---
        assistant_reply = ""
        conversation_ended = False
        feeling_better_acknowledged = False
        recommendations_obj = None # Use different name to avoid conflict with module

        if user_text.lower() in ["exit", "quit", "bye", "stop"]:
            assistant_reply = f"Okay {state['name']}, ending our chat here. Take care!"
            conversation_ended = True
        elif any(phrase in user_text.lower() for phrase in ["feel better", "good now", "happy now", "relaxed now", "yes i feel better", "yes", "improved", "calmer"]):
            assistant_reply = f"That's wonderful to hear, {state['name']}! I'm glad our chat helped a bit. 😊"
            conversation_ended = True
            feeling_better_acknowledged = True
            state["feeling_better_flag"] = True
        elif state["rounds"] >= MAX_CHAT_ROUNDS:
            assistant_reply = f"We've chatted for a bit, {state['name']}. Remember I'm here if you need to talk more later. Let me know if you'd like some recommendations based on how you felt initially."
            conversation_ended = True

        # --- Generate Next Follow-up (if chat continues) ---
        if not conversation_ended:
            try:
                 assistant_reply = generate_followup_question(state["current_significant_emotions"], state["history"], llm=llm)
            except Exception as e:
                 logging.error(f"Follow-up question generation failed for user {user_id}: {e}")
                 raise HTTPException(status_code=500, detail="Failed to generate chat response.")
            state["history"].append({"role": "assistant", "content": assistant_reply})

        # --- Generate Recommendations if Conversation Ended ---
        if conversation_ended:
            try:
                # Call recommendation function from logic, passing sp
                recommendations_data = generate_recommendations(state["initial_significant_emotions"], sp=sp)
                recommendations_obj = RecommendationOutput(**recommendations_data) # Create Pydantic obj
                if assistant_reply: assistant_reply += "\n\nBased on how you were feeling, here are some ideas:"
                else: assistant_reply = "Based on how you were feeling, here are some ideas:"
            except Exception as e:
                logging.error(f"Recommendation generation failed for user {user_id}: {e}")
                if assistant_reply: assistant_reply += "\n\n(Sorry, couldn't fetch recommendations right now.)"
                else: assistant_reply = "Okay, ending chat. (Sorry, couldn't fetch recommendations right now.)"

            # --- Clean up state for ended conversation ---
            if user_id in conversations: # Check if key exists before deleting
                 del conversations[user_id]
                 logging.info(f"Conversation ended and state cleared for user_id: {user_id}")
            else:
                 logging.warning(f"Attempted to delete state for user_id {user_id}, but it was already removed.")


        # --- Return Response ---
        return ChatResponse(
            user_id=user_id,
            assistant_message=assistant_reply,
            conversation_ended=conversation_ended,
            feeling_better_acknowledged=feeling_better_acknowledged,
            recommendations=recommendations_obj, # Assign Pydantic obj here
            current_significant_emotions=state.get("current_significant_emotions")
        )


# === Root Endpoint ===
@app.get("/", tags=["Status"])
async def root():
    """Basic status endpoint to check if the API is running."""
    return {"message": "Mood Aware Chatbot API is running. POST to /chat/message to interact."}

# === Run the API ===
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    logging.info(f"Starting Uvicorn server on host 0.0.0.0, port {port}")
    # Note: reload=True is useful for development as it restarts the server on code changes,
    # but ensure it's False for production. It will call the startup event again on reload.
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)