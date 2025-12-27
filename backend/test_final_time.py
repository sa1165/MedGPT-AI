import requests
import time
import json

url = "http://localhost:8000/chat"

tests = [
    ("Hi", "Simple greeting"),
    ("What is diabetes?", "Medical definition"),
]

print("=" * 60)
print("Response Time Analysis")
print("=" * 60)

for message, description in tests:
    payload = {
        "session_id": f"test_{time.time()}",
        "message": message,
        "mode": "quick_triage"
    }
    
    print(f"\nTest: {description}")
    print(f"Query: '{message}'")
    
    start = time.time()
    try:
        response = requests.post(url, json=payload, timeout=30)
        elapsed = time.time() - start
        
        status_icon = "✅" if elapsed < 5.0 else "❌"
        print(f"{status_icon} Time: {elapsed:.2f}s (target: <5.0s)")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Response: {data.get('message', '')[:80]}...")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    
    time.sleep(0.5)

print("\n" + "=" * 60)
