import httpx
import asyncio

async def list_models():
    url = "http://localhost:11434/api/tags"
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url)
            models = [m['name'] for m in resp.json()['models']]
            print("AVAILABLE_MODELS_START")
            for m in models:
                print(m)
            print("AVAILABLE_MODELS_END")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(list_models())
