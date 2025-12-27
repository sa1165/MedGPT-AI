import httpx
import asyncio

URL = "http://localhost:8000/chat"

async def trigger_chat():
    payload = {
        "message": "hello",
        "session_id": "debug-session"
    }
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(URL, json=payload, timeout=30.0)
            print(f"STATUS: {response.status_code}")
            print(f"RESPONSE: {response.text}")
        except Exception as e:
            print(f"ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(trigger_chat())
