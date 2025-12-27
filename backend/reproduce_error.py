
import requests
import json

url = "http://localhost:8000/chat"
payload = {
    "message": "hello",
    "session_id": "test_session_123",
    "mode": "quick_triage"
}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Request failed: {e}")

# Also verify prompt.py import
try:
    from app.core.prompt import get_system_prompt
    print("Successfully imported get_system_prompt")
    print(f"Triage prompt length: {len(get_system_prompt('quick_triage'))}")
except Exception as e:
    print(f"Failed to import prompt.py: {e}")
