import httpx
import asyncio
import os
import json
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = "gemini-1.5-flash-8b"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={GEMINI_API_KEY}"

async def test_8b():
    payload = {
        "contents": [{"parts": [{"text": "Hello"}]}]
    }
    
    async with httpx.AsyncClient() as client:
        try:
            print(f"Testing {MODEL}...")
            response = await client.post(URL, json=payload, timeout=30.0)
            if response.status_code == 200:
                print("SUCCESS: 200 OK")
            else:
                print(f"FAILED: {response.status_code}")
                print(response.text[:200])
        except Exception as e:
            print(f"Exception: {e}")

if __name__ == "__main__":
    asyncio.run(test_8b())
