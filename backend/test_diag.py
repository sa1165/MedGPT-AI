import httpx
import asyncio
import os
import json
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

MODELS_TO_TEST = [
    "gemini-1.5-pro-latest",
    "gemini-1.5-pro",
    "gemini-exp-1206",
    "gemini-2.0-flash-lite-001",
    "gemini-2.5-pro"
]

async def test_models():
    with open("diag_results.txt", "w") as f:
        async with httpx.AsyncClient() as client:
            for model in MODELS_TO_TEST:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}"
                payload = {"contents": [{"parts": [{"text": "Hello"}]}]}
                try:
                    f.write(f"--- Testing {model} ---\n")
                    response = await client.post(url, json=payload, timeout=10.0)
                    f.write(f"Status: {response.status_code}\n")
                    if response.status_code != 200:
                        f.write(f"Error: {response.text[:200]}\n")
                    else:
                        f.write("SUCCESS!\n")
                except Exception as e:
                    f.write(f"Exc: {e}\n")

if __name__ == "__main__":
    asyncio.run(test_models())
