import httpx
import asyncio
import os

GEMINI_API_KEY = "AIzaSyCORQUBecgvsKqJBk5VVci9xvozsI9CGCQ"
MODEL = "gemini-flash-latest"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={GEMINI_API_KEY}"

async def test_generation():
    payload = {"contents": [{"parts": [{"text": "Hello"}]}]}
    async with httpx.AsyncClient() as client:
        response = await client.post(URL, json=payload, timeout=30.0)
        print(f"STATUS_CODE: {response.status_code}")
        if response.status_code != 200:
             print(f"ERROR_BODY: {response.text[:200]}")

if __name__ == "__main__":
    asyncio.run(test_generation())
