# Environment Variables Setup

The backend now uses `python-dotenv` to load environment variables from a `.env` file.

## Creating the .env File

Create a file named `.env` in the `/backend` directory with the following content:

```
# Path to the LLM model
MODEL_PATH=D:\Mistral-7B-Instruct-v0.3-GGUF\Mistral-7B-Instruct-v0.3-Q4_K_M.gguf

# API Keys for external services
RAPIDAPI_KEY=your_rapidapi_key_here

# Spotify API credentials
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
```

## Variable Explanations

1. `MODEL_PATH`: Path to your LLM model file
   - Current default: `D:\Mistral-7B-Instruct-v0.3-GGUF\Mistral-7B-Instruct-v0.3-Q4_K_M.gguf`
   - Adjust this to the actual location of your model file

2. `RAPIDAPI_KEY`: API key for RapidAPI's movie recommendation service
   - Required for movie recommendations
   - If not provided, default movie recommendations will be used

3. `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`: Credentials for the Spotify API
   - Required for music recommendations
   - If not provided, default song recommendations will be used

## Testing Without a Model

If you don't have the Mistral LLM model, you can still test the system. The backend has a fallback MockLLM that will automatically be used if the model can't be loaded.

## Checking Environment Variable Loading

After setting up your `.env` file, when you start the backend, look for these log messages to confirm successful loading:

```
INFO: FastAPI Startup: Initializing dependencies...
INFO: LLM loaded successfully.
```

Or, if using the mock LLM:

```
INFO: FastAPI Startup: Initializing dependencies...
ERROR: FATAL: Failed to load LLM: [error message]
WARNING: Using MockLLM as fallback for testing purposes
```

Both scenarios will allow the backend to function properly. 