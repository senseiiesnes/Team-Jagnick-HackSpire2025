# chatbot_logic.py
import os
import json
import requests
from datetime import datetime
import logging
from typing import Dict, List, Tuple, Optional, Any

# --- Core Dependencies ---
from ctransformers import AutoModelForCausalLM
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

# === CONFIGURATION ===
# --- Model ---
MODEL_PATH = os.getenv("MODEL_PATH", r"C:\Users\dabhi\PycharmProjects\MusicGenerator\Mistral-7B-Instruct-v0.3-GGUF\Mistral-7B-Instruct-v0.3-Q4_K_M.gguf")

# --- API Keys ---
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY", "50cf2342a0mshb97440b680941cap19e8dfjsn37c4a938569f")
SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID", 'f6ec55f6052b4f12951188ab6a1061d0')
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET", '1e67cdd34d864eba9515f8ae6752b598')

# --- Constants & Emotion Data ---
EMOTION_LIST = [
    "happiness", "sadness", "anger", "stress", "anxiety", "fear", "joy",
    "frustration", "boredom", "calmness", "excitement", "loneliness",
    "confusion", "tiredness", "motivation", "guilt", "love", "gratitude", "neutral"
]
INCOMPATIBILITY_MATRIX = {
    "happiness": ["sadness", "stress", "anxiety"], "joy": ["sadness", "stress", "anger"],
    "calmness": ["anger", "stress"], "love": ["anger", "loneliness"],
    "excitement": ["boredom", "tiredness"], "gratitude": ["anger", "guilt"],
    "neutral": ["happiness", "sadness", "fear", "anger"],
}
MOOD_TONES = {
    "happiness": "cheerful and energetic", "joy": "bright and enthusiastic", "calmness": "peaceful and gentle",
    "love": "warm and caring", "gratitude": "appreciative and kind", "sadness": "comforting and soothing",
    "anger": "calm and understanding", "stress": "relaxing and reassuring", "anxiety": "calming and supportive",
    "fear": "reassuring and protective", "frustration": "patient and encouraging", "boredom": "exciting and lively",
    "loneliness": "compassionate and friendly", "confusion": "clear and guiding", "tiredness": "gentle and supportive",
    "motivation": "inspiring and energetic", "guilt": "forgiving and comforting", "neutral": "balanced and neutral",
}
DOWNER_MOODS = {"sadness", "loneliness", "guilt", "fear", "stress", "anxiety", "tiredness", "frustration", "anger", "boredom"}
MAX_CHAT_ROUNDS = 5 # Can be defined here or in main.py depending on preference

# === Initialization Function ===

def initialize_dependencies() -> Tuple[Optional[Any], Optional[spotipy.Spotify]]:
    """Loads LLM and initializes Spotify client."""
    llm = None
    sp = None
    logging.info("Initializing chatbot dependencies...")

    # --- Load LLM ---
    try:
        if not MODEL_PATH or not os.path.exists(MODEL_PATH):
             raise FileNotFoundError(f"Model path '{MODEL_PATH}' not found or not set.")
        llm = AutoModelForCausalLM.from_pretrained(
            MODEL_PATH, model_type="mistral", temperature=0.5, max_new_tokens=300,
        )
        logging.info("LLM loaded successfully.")
    except Exception as e:
        logging.error(f"FATAL: Failed to load LLM: {e}")
        llm = None # Ensure llm is None if loading failed

    # --- Initialize Spotify ---
    if not SPOTIFY_CLIENT_ID or not SPOTIFY_CLIENT_SECRET:
         logging.warning("Spotify Client ID or Secret not provided. Spotify features disabled.")
         sp = None
    else:
        try:
            auth_manager = SpotifyClientCredentials(client_id=SPOTIFY_CLIENT_ID, client_secret=SPOTIFY_CLIENT_SECRET)
            sp = spotipy.Spotify(auth_manager=auth_manager)
            sp.search(q='test', type='track', limit=1) # Test query
            logging.info("Spotify authentication successful.")
        except Exception as e:
            logging.error(f"Failed to authenticate with Spotify: {e}")
            sp = None # Ensure sp is None if auth failed

    if llm is None:
        logging.error("LLM initialization failed. Chatbot core functionality will be unavailable.")

    return llm, sp

# === Core Logic Functions ===
# --- LLM & API Dependent Functions ---
# **Note:** These functions now require `llm` or `sp` to be passed as arguments

def detect_emotion_percentages(text: str, llm: Any) -> dict:
    """Analyzes text to detect emotion percentages using the provided LLM."""
    if not llm:
        logging.error("detect_emotion_percentages called without initialized LLM.")
        return {"neutral": 100.0, **{em: 0.0 for em in EMOTION_LIST if em != "neutral"}}

    prompt = f"""
Analyze the user's text and assign a percentage score to each emotion in the list: {", ".join(EMOTION_LIST)}.
The percentages must sum to 100%. Format the output strictly as:
Emotion Probabilities:
emotion1: X%
emotion2: Y%
...
User Input: "{text}"
"""
    try:
        response = llm(prompt) # Use the passed llm object
        # --- Parsing Logic (same as before) ---
        if "Emotion Probabilities:" not in response:
            logging.warning("LLM did not return expected 'Emotion Probabilities:' header.")
            cleaned = response.strip()
        else:
            cleaned = response.split("Emotion Probabilities:")[-1].strip()

        emotion_scores = {emotion: 0.0 for emotion in EMOTION_LIST}
        total_percent = 0.0
        for line in cleaned.splitlines():
            if ":" in line:
                try:
                    parts = line.strip().split(":")
                    emotion = parts[0].strip().lower()
                    percent_str = parts[1].strip().replace("%", "")
                    percent = float(percent_str)
                    if emotion in EMOTION_LIST:
                        emotion_scores[emotion] = percent
                        total_percent += percent
                except (ValueError, IndexError):
                    logging.warning(f"Could not parse emotion line: '{line}'")
                    continue

        if total_percent > 0 and abs(total_percent - 100.0) > 1.0 :
             logging.warning(f"Emotion percentages sum to {total_percent}%. Normalizing.")
             norm_factor = 100.0 / total_percent
             for emotion in emotion_scores:
                 emotion_scores[emotion] *= norm_factor
        elif total_percent == 0:
             logging.warning("LLM returned zero percentages for all emotions.")
             emotion_scores["neutral"] = 100.0

        if "neutral" not in emotion_scores:
            emotion_scores["neutral"] = 0.0
        # --- End Parsing Logic ---
        return emotion_scores
    except Exception as e:
        logging.error(f"Error during emotion detection: {e}")
        return {"neutral": 100.0, **{em: 0.0 for em in EMOTION_LIST if em != "neutral"}}


def generate_followup_question(significant_emotions: list, conversation_history: list, llm: Any) -> str:
    """Generates a follow-up question using the provided LLM."""
    if not llm:
         logging.error("generate_followup_question called without initialized LLM.")
         return "How are you feeling about things?" # Generic fallback

    primary_emotion = significant_emotions[0] if significant_emotions else "neutral"
    tone = MOOD_TONES.get(primary_emotion, "neutral")
    history_text = "\n".join([f"{entry['role']}: {entry['content']}" for entry in conversation_history[-6:]])
    if not history_text: history_text = "(Start of conversation)"

    prompt = f"""
You are a {tone} AI companion. Goal: supportive, understanding.
User's significant emotions: {', '.join(significant_emotions)}.
Recent conversation:
{history_text}

Generate ONE gentle, thoughtful, open-ended follow-up question based on the user's emotions and conversation. Keep it concise. Avoid solutions.
Assistant Question:
"""
    try:
        response = llm(prompt) # Use the passed llm object
        if "Assistant Question:" in response:
            response = response.split("Assistant Question:")[-1]
        return response.strip().strip('"')
    except Exception as e:
        logging.error(f"Error generating follow-up question: {e}")
        return f"How are you feeling about that?" # Fallback

# --- Recommendation API Functions ---
# These functions don't directly need LLM, but fetch_spotify_songs needs `sp`

def fetch_rapidapi_movies(emotion):
    logging.info(f"Fetching movies for emotion: {emotion} using RapidAPI")
    url = "https://ai-movie-recommender.p.rapidapi.com/api/search"
    query = f"movies related to feeling {emotion}"
    querystring = {"q": query}
    headers = {"x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": "ai-movie-recommender.p.rapidapi.com"}
    default_movies = ["Could not fetch movies", "Check connection or API key."]
    try:
        response = requests.get(url, headers=headers, params=querystring, timeout=10)
        response.raise_for_status()
        data = response.json()
        movies = data.get("movies", [])
        if movies: return [movie.get("title", "Unknown Title") for movie in movies[:2]]
        else: return ["No specific movies found", "Maybe try a general feel-good film?"]
    except Exception as e:
        logging.error(f"RapidAPI movie error: {e}")
        return default_movies

def fetch_openlibrary_books(emotion):
    logging.info(f"Fetching books for emotion: {emotion} using Open Library")
    url = f"https://openlibrary.org/search.json?q={emotion}&limit=5"
    default_books = ["Could not fetch books", "Try searching online!"]
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        books = data.get('docs', [])
        if books:
            return [f"{book.get('title', 'Unknown Title')} by {book.get('author_name', ['Unknown Author'])[0]}" for book in books[:2]]
        else: return ["No specific books found", "Maybe explore a local library?"]
    except Exception as e:
        logging.error(f"Open Library error: {e}")
        return default_books

def fetch_spotify_songs(keyword: str, sp: Optional[spotipy.Spotify]):
    """Fetches songs from Spotify using the provided client."""
    logging.info(f"Fetching songs for keyword: {keyword} using Spotify")
    if not sp:
        logging.warning("Spotify client not available. Cannot fetch songs.")
        return ["Spotify unavailable", "Check credentials."]

    search_query = keyword
    if keyword == "uplifting": search_query = "uplifting OR happy OR positive energy"
    default_songs = ["Could not fetch songs", "Check Spotify connection."]
    try:
        results = sp.search(q=search_query, type='track', limit=5) # Use passed sp client
        tracks = results.get('tracks', {}).get('items', [])
        if tracks: return [f"{track['name']} by {track['artists'][0]['name']}" for track in tracks[:2]]
        else:
            if keyword == "uplifting": return ["'Happy' by Pharrell Williams", "'Walking on Sunshine' by Katrina & The Waves"]
            else: return ["No specific songs found", "Maybe try a favorite artist?"]
    except Exception as e:
        logging.error(f"Spotify API error: {e}")
        return default_songs

def generate_recommendations(significant_emotions: list, sp: Optional[spotipy.Spotify]) -> dict:
    """Generates movie, book, and song recommendations."""
    primary_emotion = significant_emotions[0] if significant_emotions else "neutral"
    logging.info(f"Generating recommendations for primary emotion: {primary_emotion}")
    spotify_keyword = "uplifting" if primary_emotion in DOWNER_MOODS else primary_emotion

    # Call fetch functions, passing sp where needed
    movies = fetch_rapidapi_movies(primary_emotion)
    books = fetch_openlibrary_books(primary_emotion)
    songs = fetch_spotify_songs(spotify_keyword, sp) # Pass sp here

    return {
        "movies": movies,
        "books": books,
        "songs": songs,
        "music_category": 'Uplifting' if spotify_keyword == 'uplifting' else primary_emotion.capitalize()
    }

# --- Helper Functions (Conflict Resolution, Significance) ---
# These don't depend on LLM or SP, so no changes needed
def resolve_conflicts(emotion_scores: dict, selected_emotions: list) -> list:
    # (Using the improved logic from the previous script)
    selected = selected_emotions.copy()
    resolved_list = []
    emotions_to_process = set(selected)
    while emotions_to_process:
        current_emotion = emotions_to_process.pop()
        is_compatible = True
        incompatible_list = INCOMPATIBILITY_MATRIX.get(current_emotion, [])
        temp_resolved = resolved_list.copy()
        for other_emotion in temp_resolved:
            other_incompatible_list = INCOMPATIBILITY_MATRIX.get(other_emotion, [])
            if other_emotion in incompatible_list or current_emotion in other_incompatible_list:
                if emotion_scores.get(current_emotion, 0) < emotion_scores.get(other_emotion, 0):
                    is_compatible = False; break
                else:
                    resolved_list.remove(other_emotion)
        if is_compatible: resolved_list.append(current_emotion)
    final_resolved = []
    emotions_to_recheck = set(resolved_list)
    while emotions_to_recheck:
        current_emotion = emotions_to_recheck.pop()
        is_compatible = True
        incompatible_list = INCOMPATIBILITY_MATRIX.get(current_emotion, [])
        temp_final = final_resolved.copy()
        for other_emotion in temp_final:
            other_incompatible_list = INCOMPATIBILITY_MATRIX.get(other_emotion, [])
            if other_emotion in incompatible_list or current_emotion in other_incompatible_list:
                 if emotion_scores.get(current_emotion, 0) < emotion_scores.get(other_emotion, 0):
                    is_compatible = False; break
                 else: final_resolved.remove(other_emotion)
        if is_compatible: final_resolved.append(current_emotion)
    final_resolved.sort(key=lambda e: emotion_scores.get(e, 0), reverse=True)
    return final_resolved

def get_significant_emotions(emotion_scores: dict, threshold=30.0) -> list:
    if not emotion_scores: return ["neutral"]
    strong_emotions = [e for e, s in emotion_scores.items() if s >= threshold]
    if not strong_emotions:
        sorted_emotions = sorted(emotion_scores.items(), key=lambda x: x[1], reverse=True)
        strong_emotions = [e for e, s in sorted_emotions[:3] if s > 0]
        if not strong_emotions: return ["neutral"]
    resolved = resolve_conflicts(emotion_scores, strong_emotions)
    if not resolved:
         sorted_emotions = sorted(emotion_scores.items(), key=lambda x: x[1], reverse=True)
         if sorted_emotions and sorted_emotions[0][1] > 0: return [sorted_emotions[0][0]]
         else: return ["neutral"]
    return resolved