import asyncio
import httpx
import json

async def test_ollama():
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": "llama3.2",
        "prompt": "hi",
        "stream": False,
        "format": "json"
    }
    print(f"Testing Ollama at {url} with model 'llama3'...")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, timeout=30.0)
            print(f"Status Code: {response.status_code}")
            if response.status_code == 200:
                print("Success!")
                print("Response:", response.json())
            else:
                print("Error Response:", response.text)
        except Exception as e:
            print(f"Exception: {e}")

if __name__ == "__main__":
    asyncio.run(test_ollama())
