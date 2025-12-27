import requests
import time

url = "http://localhost:8000/chat"

# Simple test
payload = {
    "session_id": "quick_test",
    "message": "What is diabetes?",
    "mode": "quick_triage"
}

print("Testing response time...")
start = time.time()
response = requests.post(url, json=payload, timeout=30)
elapsed = time.time() - start

print(f"\nResponse time: {elapsed:.2f} seconds")
print(f"Status: {'✅ PASS' if elapsed <= 5.0 else '❌ FAIL (target: <5s)'}")
print(f"\nResponse preview:")
if response.status_code == 200:
    data = response.json()
    print(f"Message: {data.get('message', '')[:200]}...")
else:
    print(f"Error: HTTP {response.status_code}")
