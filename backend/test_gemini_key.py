import httpx
import asyncio
import os
import json

GEMINI_API_KEY = "AIzaSyCORQUBecgvsKqJBk5VVci9xvozsI9CGCQ"
URL = f"https://generativelanguage.googleapis.com/v1beta/models?key={GEMINI_API_KEY}"

async def list_models():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(URL, timeout=30.0)
            with open("models.txt", "w") as f:
                if response.status_code == 200:
                    data = response.json()
                    for model in data.get("models", []):
                        f.write(model.get("name") + "\n")
                else:
                    f.write(f"Error: {response.status_code}\n{response.text}")
        except Exception as e:
            with open("models.txt", "w") as f:
                f.write(str(e))

if __name__ == "__main__":
    asyncio.run(list_models())
