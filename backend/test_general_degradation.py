import asyncio
import os
import sys
import json

# Add the current directory to sys.path
sys.path.append(os.getcwd())

from app.core.llm import get_llm_response

async def test_general():
    queries = ["who are you", "what can you do", "what is cancer", "What does 'ovary' mean?"]
    for query in queries:
        print(f"\n--- Testing Query: {query} ---")
        try:
            response = await get_llm_response([], query, mode="quick_triage")
            print("Response:")
            print(response)
            parsed = json.loads(response)
            if not (parsed.get("message") or parsed.get("response") or parsed.get("text")):
                print("WARNING: No message content found in JSON!")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_general())
