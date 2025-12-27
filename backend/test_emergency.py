import httpx
import asyncio
import os
import json
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = "gemini-flash-latest"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={GEMINI_API_KEY}"

SYSTEM_PROMPT = """You are MedGPT... (safety critical)
...
### RESPONSE FORMAT
...
"""

async def test_emergency():
    # Simulate the conversation leading to the error
    history_mock = [
        {"role": "user", "parts": [{"text": "im having cold"}]},
        {"role": "model", "parts": [{"text": "Describe symptoms"}]},
        {"role": "user", "parts": [{"text": "runny nose and head ache"}]},
        {"role": "model", "parts": [{"text": "How long and severity 1-10?"}]},
        {"role": "user", "parts": [{"text": "8"}]}
    ]
    
    payload = {
        "contents": history_mock,
        "system_instruction": {
            "parts": [{"text": "You are a medical assistant. If severity is high (e.g. 8/10 headache), output emergency stage."}]
        },
        # Explicitly check if safety settings are needed?
        "safetySettings": [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
        ]
    }
    
    async with httpx.AsyncClient() as client:
        try:
            print("Requesting emergency response...")
            # First try WITHOUT explicit safety settings to see if it fails like the app
            # Actually, let's try to reproduce the failure. The app DOES NOT have safety settings in llm.py
            
            # Payload WITHOUT safety settings
            payload_no_safety = {
                "contents": history_mock,
                "system_instruction": {"parts": [{"text": "You are a medical assistant."}]}
            }

            response = await client.post(URL, json=payload_no_safety, timeout=30.0)
            print(f"STATUS: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                # Check directly for finishReason or safetyRatings
                candidates = data.get("candidates", [])
                if candidates:
                    print(f"Finish Reason: {candidates[0].get('finishReason')}")
                    if candidates[0].get('finishReason') == "SAFETY":
                        print("BLOCKED BY SAFETY")
                        print(json.dumps(candidates[0].get("safetyRatings"), indent=2))
                    elif "content" in candidates[0]:
                        print(f"Content: {candidates[0]['content']['parts'][0]['text']}")
                else:
                    print(f"No candidates? {json.dumps(data, indent=2)}")
            else:
                print(f"ERROR: {response.text}")
        except Exception as e:
            print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    asyncio.run(test_emergency())
