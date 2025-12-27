import httpx
import asyncio
import os
import json

GEMINI_API_KEY = "AIzaSyCORQUBecgvsKqJBk5VVci9xvozsI9CGCQ"
MODEL = "gemini-flash-latest"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={GEMINI_API_KEY}"

async def test_structure():
    # Prompt similar to the app's system prompt
    prompt = '''You are AI MedGPT. Output JSON. 
    Format: {"stage": "interview", "urgency": "Low", "message": "Your response here", "confidence": 1.0}'''
    
    payload = {
        "contents": [{"parts": [{"text": "Hello"}]}],
        "system_instruction": {
            "parts": [{"text": prompt}]
        }
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(URL, json=payload, timeout=30.0)
            print(f"STATUS: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                try:
                    text = data["candidates"][0]["content"]["parts"][0]["text"]
                    print(f"RAW TEXT: {text}")
                except KeyError:
                    print(f"UNEXPECTED STRUCTURE: {json.dumps(data, indent=2)}")
            else:
                print(f"ERROR: {response.text}")
        except Exception as e:
            print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    asyncio.run(test_structure())
