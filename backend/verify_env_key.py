import httpx
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
URL = f"https://generativelanguage.googleapis.com/v1beta/models?key={GEMINI_API_KEY}"

async def list_models():
    print(f"Testing key: {GEMINI_API_KEY[:10]}...")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(URL, timeout=30.0)
            if response.status_code == 200:
                data = response.json()
                models = [m.get("name") for m in data.get("models", [])]
                print("Available models:")
                for m in models:
                    print(f" - {m}")
            else:
                print(f"Error {response.status_code}: {response.text}")
        except Exception as e:
            print(f"Exception: {e}")

if __name__ == "__main__":
    asyncio.run(list_models())
