import httpx
import asyncio
import json

URL = "http://localhost:8000/chat"

async def test_emergency_flow():
    # We need to simulate the conversation state or just send the trigger message
    # The backend handles state in memory by session_id. 
    # Let's start a new session.
    
    session_id = "test-emergency-fix"
    
    # 1. Hello
    print("1. Sending 'hello'...")
    async with httpx.AsyncClient() as client:
        resp = await client.post(URL, json={"message": "hello", "session_id": session_id}, timeout=30.0)
        print(f"Resp 1: {resp.json().get('message')[:50]}...")
        
    # 2. Symptoms
    print("2. Sending 'runny nose and head ache'...")
    async with httpx.AsyncClient() as client:
        resp = await client.post(URL, json={"message": "runny nose and head ache", "session_id": session_id}, timeout=30.0)
        print(f"Resp 2: {resp.json().get('message')[:50]}...")

    # 3. Trigger
    print("3. Sending '8' (Severe headache)...")
    async with httpx.AsyncClient() as client:
        resp = await client.post(URL, json={"message": "8", "session_id": session_id}, timeout=30.0)
        data = resp.json()
        print(f"STATUS: {resp.status_code}")
        print(f"STAGE: {data.get('stage')}")
        print(f"URGENCY: {data.get('urgency')}")
        print(f"MESSAGE: {data.get('message')}")

if __name__ == "__main__":
    asyncio.run(test_emergency_flow())
