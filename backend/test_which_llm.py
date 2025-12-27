import requests
import time

url = "http://localhost:8000/chat"

# Test with a simple query
payload = {
    "session_id": "gemini_test",
    "message": "Hi",
    "mode": "quick_triage"
}

print("Testing with simple query to check which LLM is being used...")
print("(Check backend logs for 'Gemini' or 'Ollama' messages)\n")

start = time.time()
try:
    response = requests.post(url, json=payload, timeout=30)
    elapsed = time.time() - start
    
    print(f"Response time: {elapsed:.2f} seconds")
    print(f"Status code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\nResponse received:")
        print(f"Stage: {data.get('stage')}")
        print(f"Message: {data.get('message', '')[:150]}...")
    
    # Performance assessment
    if elapsed < 3:
        print(f"\n✅ EXCELLENT - Likely using Gemini API")
    elif elapsed < 5:
        print(f"\n✅ GOOD - Meeting 5s target")
    elif elapsed < 8:
        print(f"\n⚠️  ACCEPTABLE - Close to target, likely using Ollama")
    else:
        print(f"\n❌ SLOW - Needs optimization")
        
except Exception as e:
    print(f"Error: {e}")
