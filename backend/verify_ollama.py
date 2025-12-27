import httpx
import asyncio

async def verify_models():
    url = "http://localhost:11434/api/tags"
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, timeout=5.0)
            if resp.status_code == 200:
                data = resp.json()
                models = [m['name'] for m in data.get('models', [])]
                print(f"Found models: {models}")
                if any('llama3' in m for m in models):
                    print("SUCCESS: llama3 is installed.")
                else:
                    print("FAIL: llama3 not found.")
            else:
                print(f"Error: {resp.status_code}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    asyncio.run(verify_models())
