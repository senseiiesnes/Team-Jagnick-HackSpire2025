# How to Fix Backend 503 Service Unavailable Errors

The current integration is working for storing chat history, but there's a 503 Service Unavailable error when trying to use the AI service. This error occurs because the LLM (Language Learning Model) is not being properly initialized in the backend.

## The Problem

In `chatbot_logic.py`, the model path is hardcoded to a specific Windows path:

```python
MODEL_PATH = os.getenv("MODEL_PATH", r"C:\Users\dabhi\PycharmProjects\MusicGenerator\Mistral-7B-Instruct-v0.3-GGUF\Mistral-7B-Instruct-v0.3-Q4_K_M.gguf")
```

This path may not exist on your system, causing the LLM initialization to fail, which results in a 503 error.

## Solution 1: Update the Model Path

1. Open `backend/chatbot_logic.py`
2. Locate the MODEL_PATH variable near the beginning of the file
3. Change it to point to your correct model path:

```python
MODEL_PATH = os.getenv("MODEL_PATH", "/path/to/your/model/Mistral-7B-Instruct-v0.3-Q4_K_M.gguf")
```

## Solution 2: Set the Environment Variable

Instead of changing the code, you can set an environment variable:

1. For Windows:
   ```
   set MODEL_PATH=D:\path\to\your\model\Mistral-7B-Instruct-v0.3-Q4_K_M.gguf
   ```

2. For Linux/macOS:
   ```
   export MODEL_PATH=/path/to/your/model/Mistral-7B-Instruct-v0.3-Q4_K_M.gguf
   ```

3. Then start the backend:
   ```
   python backend/main.py
   ```

## Solution 3: Create a Mock AI Service (For Testing Only)

If you want to test the integration without the full LLM, you can modify the initialize_dependencies function in chatbot_logic.py to return a simple mock:

```python
def initialize_dependencies():
    """Loads LLM and initializes Spotify client."""
    class MockLLM:
        def __call__(self, text):
            return f"This is a mock response to: {text}"

    llm = MockLLM()
    sp = None
    return llm, sp
```

This will bypass the LLM initialization and allow the backend to work without the model.

## Checking if it's Fixed

After making these changes, restart the backend and check the console logs. If successful, you should see:

```
INFO: FastAPI Startup: Initializing dependencies...
INFO: LLM loaded successfully.
```

And the 503 errors should be resolved when using the chat.

## Additional Notes

- Make sure you have the required Python packages installed: `pip install -r backend/requirements.txt`
- If using a large language model like Mistral-7B, ensure your system has sufficient RAM
- The model file can be downloaded from Hugging Face: https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.3-GGUF/tree/main 