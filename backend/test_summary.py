import httpx
import asyncio
import os
import json
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = "gemini-flash-latest"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={GEMINI_API_KEY}"

SYSTEM_PROMPT = """You are MedGPT... (truncated for brevity, assumes model knows role or I paste full prompt if needed)
...
### RESPONSE FORMAT
You must output a JSON object with the following keys:
{
  "stage": "interview" | "emergency" | "summary",
  "urgency": "Low" | "Moderate" | "High",
  "message": "The text content of your response to the user",
  "confidence": 0.0 to 1.0 (float)
}
"""

async def test_summary():
    # Simulate a history leading to summary
    history_mock = [
        {"role": "user", "parts": [{"text": "I'm trying to lose weight but no progress"}]},
        {"role": "model", "parts": [{"text": "How long have you been trying?"}]},
        {"role": "user", "parts": [{"text": "2 weeks, improper diet"}]},
        {"role": "model", "parts": [{"text": "Summarize my case now."}]}
    ]
    
    # We ask explicitly for a summary to force the behavior
    # Note: Using the exact system prompt from app is best, but let's try to mimic the "Output JSON" constraint
    
    payload = {
        "contents": history_mock,
        "system_instruction": {
            "parts": [{"text": SYSTEM_PROMPT}]
        }
    }
    
    async with httpx.AsyncClient() as client:
        try:
            print("Requesting summary...")
            response = await client.post(URL, json=payload, timeout=30.0)
            if response.status_code == 200:
                data = response.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                print(f"RAW RESPONSE:\n{text}")
            else:
                print(f"ERROR: {response.text}")
        except Exception as e:
            print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    asyncio.run(test_summary())
