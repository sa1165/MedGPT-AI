import httpx
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

async def test_new_key():
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={GEMINI_API_KEY}"
    payload = {"contents": [{"parts": [{"text": "Hello, test message"}]}]}
    
    async with httpx.AsyncClient() as client:
        try:
            print(f"Testing new API key with gemini-flash-latest...")
            response = await client.post(url, json=payload, timeout=10.0)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                print("✓ SUCCESS! New API key is working!")
                data = response.json()
                print(f"Response: {data['candidates'][0]['content']['parts'][0]['text'][:100]}")
            elif response.status_code == 429:
                print("✗ Rate limit (429) - This key is also quota exhausted")
            else:
                print(f"Error: {response.text[:200]}")
        except Exception as e:
            print(f"Exception: {e}")

if __name__ == "__main__":
    asyncio.run(test_new_key())
