import httpx
import asyncio
import json

async def pull_ollama_model():
    url = "http://localhost:11434/api/pull"
    payload = {"name": "llama3.2"}
    
    print("Initiating pull for 'llama3.2'...")
    async with httpx.AsyncClient(timeout=None) as client:
        async with client.stream("POST", url, json=payload) as response:
            async for line in response.aiter_lines():
                if line:
                    try:
                        data = json.loads(line)
                        if "total" in data and "completed" in data:
                            percent = (data["completed"] / data["total"]) * 100
                            print(f"Pulling: {percent:.1f}%", end="\r")
                        if data.get("status") == "success":
                            print("\nSUCCESS: Model pulled successfully!")
                            return
                    except Exception as e:
                        print(f"Error parsing line: {e}")
                        pass
    print("\nFinished.")

if __name__ == "__main__":
    asyncio.run(pull_ollama_model())
