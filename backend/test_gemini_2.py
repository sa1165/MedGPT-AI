import httpx
import asyncio
import os
import json

GEMINI_API_KEY = "AIzaSyCORQUBecgvsKqJBk5VVci9xvozsI9CGCQ"
MODEL = "gemini-2.0-flash"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={GEMINI_API_KEY}"

async def test_generation():
    payload = {
        "contents": [{"parts": [{"text": "Hello"}]}]
    }
    async with httpx.AsyncClient() as client:
        try:
            print(f"Testing {MODEL} generation...")
            response = await client.post(URL, json=payload, timeout=30.0)
            if response.status_code == 200:
                print(f"SUCCESS: {response.json()}")
            else:
                print(f"FAILED: {response.status_code}")
                print(f"Response: {response.text}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_generation())
