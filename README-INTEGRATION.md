# MindMosaic AI Chatbot Integration

This guide explains how to set up and run the integrated MindMosaic AI Chatbot with the frontend and backend components.

## Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- MongoDB (local installation or MongoDB Atlas account)

## Setup

### 1. MongoDB Setup

Install MongoDB or use MongoDB Atlas, then create a database named `mindmosaic`.

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

Run the FastAPI backend:

```bash
python main.py
```

The backend will be available at http://localhost:8000

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install the required npm packages:

```bash
npm install
```

Create a `.env.local` file in the frontend directory with the following content:

```
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/mindmosaic

# NextAuth Secret (replace with a secure random string in production)
NEXTAUTH_SECRET=mysecret
NEXTAUTH_URL=http://localhost:3000

# FastAPI Backend URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

Run the Next.js frontend:

```bash
npm run dev
```

The frontend will be available at http://localhost:3000

## Using the Application

1. Register or log in to the application
2. Navigate to the AI Chat section
3. Start a new conversation with the AI chatbot
4. Previous chats will be displayed in the sidebar

## Features

- AI chatbot with emotion detection and response generation
- Chat history stored in MongoDB
- Recommendations based on emotional state
- Sidebar with previous chat sessions
- User authentication

## Troubleshooting

- **Backend connection issues**: Make sure the FastAPI backend is running and the NEXT_PUBLIC_BACKEND_URL in your .env.local file is correct.
- **MongoDB connection issues**: Verify your MongoDB connection string in the .env.local file.
- **Chat history not loading**: Ensure that you are authenticated and the MongoDB database is accessible.

## Implementation Details

### Backend-Frontend Integration

The integration works as follows:

1. When a user sends a message from the frontend, it's sent to the Next.js API endpoint `/api/chat`.
2. The Next.js API:
   - Stores the user message in MongoDB
   - Forwards the message to the FastAPI backend at `/chat/message`
   - Receives the AI response with emotions analysis and recommendations
   - Stores the AI response in MongoDB
   - Returns the response to the frontend

3. Chat history is stored in MongoDB with the following structure:
   ```
   {
     user_id: "user-id",
     messages: [
       { role: "user", content: "message text", timestamp: Date },
       { role: "assistant", content: "response text", timestamp: Date, significant_emotions: ["emotion1", "emotion2"] }
     ],
     createdAt: Date,
     updatedAt: Date,
     ended: Boolean,
     feeling_better: Boolean
   }
   ```

4. When the user opens the chat page, the sidebar displays previous conversations fetched from MongoDB. Clicking on a conversation loads the full chat history.

5. The UI displays:
   - Messages between the user and AI
   - Detected emotions for each AI response
   - Recommendations when the conversation ends
   - Status indicators for completed conversations

This implementation ensures all chat data is stored persistently in MongoDB while leveraging the emotion detection and recommendation capabilities of the FastAPI backend. 