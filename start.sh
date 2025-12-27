#!/bin/bash

# Start Ollama in the background
echo ">>> Starting Ollama server..."
ollama serve &

# Wait for Ollama to be ready
echo ">>> Waiting for Ollama (5s)..."
sleep 5

# Pull the lightweight model
echo ">>> Pulling Llama 3.2 (1b)..."
ollama pull llama3.2:1b

# Start the Backend (which now serves the Frontend too)
echo ">>> Starting MedGPT on port 7860..."
cd /app/backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 7860
