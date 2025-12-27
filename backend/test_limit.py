import httpx
import asyncio

URL = "http://localhost:8000/chat"

async def test_rate_limit_handling():
    # Sending a request that we know will likely hit rate limit (since all models are 429)
    # or just normal request.
    session_id = "test-rate-limit"
    
    print("Sending request...")
    async with httpx.AsyncClient() as client:
        resp = await client.post(URL, json={"message": "hello", "session_id": session_id}, timeout=30.0)
        data = resp.json()
        print(f"STATUS: {resp.status_code}")
        print(f"MESSAGE: {data.get('message')}")

if __name__ == "__main__":
    asyncio.run(test_rate_limit_handling())
