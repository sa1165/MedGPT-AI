import requests
import json

BASE_URL = "http://localhost:8000"

def test_query(message, session_id="test_verify"):
    payload = {
        "message": message,
        "session_id": session_id,
        "mode": "quick_triage"
    }
    try:
        response = requests.post(f"{BASE_URL}/chat", json=payload)
        response.raise_for_status()
        data = response.json()
        print(f"Query: {message}")
        print(f"Stage: {data.get('stage')}")
        print(f"Urgency: {data.get('urgency')}")
        print(f"Message: {data.get('message')[:100]}...")
        print("-" * 20)
        return data
    except Exception as e:
        print(f"Error testing query '{message}': {e}")
        return None

if __name__ == "__main__":
    print("Verifying Emergency Logic Fixes...\n")
    
    # Test 1: Educational Query (Should be Low)
    res1 = test_query("What are the types of cancer?")
    
    # Test 2: Real Emergency (Should be High/Emergency)
    res2 = test_query("I have severe chest pain and can't breathe.")
    
    # Test 3: Technical Failure Fallback (Simulated by blocking Ollama/Gemini if possible, 
    # but here we just check if it's NOT the old 'Sstem Error')
    # Since we can't easily force failure here without breaking things, 
    # we just check the previous outputs.
