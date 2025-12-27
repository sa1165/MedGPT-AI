import asyncio
import sys
import os

# Ensure app is in path
sys.path.append(os.getcwd())

from app.core.llm import call_ollama

async def test():
    print("Testing Text Only:")
    try:
        resp = await call_ollama([{"role": "user", "content": "hi"}], mode="quick_triage")
        print(f"Text Response: {resp}")
    except Exception as e:
        print(f"Text Error: {e}")

    print("\nTesting With Image (Mock):")
    try:
        # Mock base64 image
        resp = await call_ollama([{"role": "user", "content": "describe this"}], mode="quick_triage", image="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=")
        print(f"Image Response: {resp}")
    except Exception as e:
        print(f"Image Error: {e}")

if __name__ == "__main__":
    asyncio.run(test())
