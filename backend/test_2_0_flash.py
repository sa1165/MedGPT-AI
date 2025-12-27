import httpx
import asyncio
import os
import json
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = "gemini-2.0-flash-exp"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={GEMINI_API_KEY}"

async def test_2_0_flash():
    # Simple hello to verify access
    payload = {
        "contents": [{"parts": [{"text": "Hello"}]}],
        "safetySettings": [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
        ]
    }
    
    async with httpx.AsyncClient() as client:
        try:
            print(f"Testing {MODEL}...")
            response = await client.post(URL, json=payload, timeout=30.0)
            if response.status_code == 200:
                print("SUCCESS: 200 OK")
                print(response.json()["candidates"][0]["content"]["parts"][0]["text"][:100])
            else:
                print(f"FAILED: {response.status_code}")
                print(response.text[:200])
        except Exception as e:
            print(f"Exception: {e}")

if __name__ == "__main__":
    asyncio.run(test_2_0_flash())
