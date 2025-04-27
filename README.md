# MindMosaic

A mental wellness application designed to provide resources, chat support, and informative content for mental health and well-being.

## Project Overview

MindMosaic combines an interactive AI chat interface with a rich collection of mental wellness resources, organized in a beautiful and accessible user interface. The application uses an emotion-aware AI chatbot backed by a language model to provide personalized support and recommendations.

## Features

- **AI Chatbot**:
  - Emotion detection from user messages
  - Contextual responses based on detected emotions
  - Personalized recommendations (books, movies, music) based on emotional state
  - Conversation history saved in MongoDB

- **User Interface**:
  - Responsive design with dark mode support
  - Chat sidebar showing previous conversations
  - Emotion tag display for AI responses
  - Recommendation cards for wellness resources

- **Integration**:
  - FastAPI Python backend for AI processing
  - Next.js frontend with MongoDB storage
  - NextAuth authentication

## Technology Stack

### Frontend
- Next.js & React
- TypeScript
- Tailwind CSS
- NextAuth.js for authentication
- MongoDB for data storage

### Backend
- FastAPI (Python)
- ctransformers (LLM inference)
- Mistral-7B language model
- Spotipy for music recommendations
- MongoDB for chat history storage

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MongoDB (local installation or MongoDB Atlas account)
- Mistral-7B-Instruct-v0.3 model (optional)

### Installation and Setup

#### 1. MongoDB Setup

Install MongoDB or use MongoDB Atlas, then create a database named `mindmosaic`.

#### 2. Backend Setup

Navigate to the backend directory and set up the environment:

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create a .env file with your configuration
```

Create a file named `.env` in the `/backend` directory with the following content:

```
# Path to the LLM model
MODEL_PATH=D:\path\to\your\model\Mistral-7B-Instruct-v0.3-Q4_K_M.gguf

# API Keys for external services
RAPIDAPI_KEY=your_rapidapi_key_here

# Spotify API credentials
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
```

Run the backend:

```bash
python main.py
```

The backend will be available at http://localhost:8000

#### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend

# Install dependencies
npm install
```

Create a `.env.local` file in the frontend directory:

```
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/mindmosaic

# NextAuth Secret (replace with a secure random string in production)
NEXTAUTH_SECRET=mysecret
NEXTAUTH_URL=http://localhost:3000

# FastAPI Backend URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

Start the frontend development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Using the Application

1. Register or log in to the application
2. Navigate to the AI Chat section
3. Start a new conversation with the AI chatbot
4. Previous chats will be displayed in the sidebar
5. When a conversation ends, you'll receive personalized recommendations

## Implementation Details

### AI Chatbot Backend

The backend uses a Mistral-7B language model to:
- Detect emotions in user messages
- Generate contextual responses
- Provide personalized recommendations

If the LLM model is not available, a MockLLM implementation will be used as a fallback.

### Backend-Frontend Integration

The integration works as follows:

1. When a user sends a message from the frontend, it's sent to the Next.js API endpoint `/api/chat`
2. The Next.js API:
   - Stores the user message in MongoDB
   - Forwards the message to the FastAPI backend
   - Receives the AI response with emotions analysis and recommendations
   - Stores the AI response in MongoDB
   - Returns the response to the frontend

3. Chat history is stored in MongoDB with emotions and recommendations

## Troubleshooting

### Backend Model Issues

If you encounter 503 Service Unavailable errors, it may be due to LLM initialization problems:

1. Check your `.env` file has the correct MODEL_PATH pointing to your LLM model
2. The model file can be downloaded from [Hugging Face](https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.3-GGUF/tree/main)
3. Ensure you have sufficient RAM for the model
4. The backend includes a fallback MockLLM if model loading fails

### Connection Issues

- **Backend connection errors**: Ensure the FastAPI backend is running and NEXT_PUBLIC_BACKEND_URL is correct
- **MongoDB connection issues**: Verify your MongoDB connection string in the .env.local file
- **Chat history not loading**: Check that you're authenticated and MongoDB is accessible

---

*MindMosaic2 is committed to creating accessible mental wellness resources and support.* 
