import requests
import json
import time

BASE_URL = "http://localhost:8000"
SESSION_ID = f"repro_{int(time.time())}"

queries = [
    "hi",
    "who are you",
    "what are the types of cancer",
    "no what i meant to ask was like breast cancer, skin , blood etc...",
    "what is epidermis",
    "what causes hairfall"
]

def run_repro():
    print(f"Starting reproduction with session: {SESSION_ID}\n")
    for i, query in enumerate(queries):
        print(f"Turn {i+1}: {query}")
        payload = {
            "message": query,
            "session_id": SESSION_ID,
            "mode": "quick_triage"
        }
        start = time.time()
        try:
            response = requests.post(f"{BASE_URL}/chat", json=payload, timeout=70.0)
            duration = time.time() - start
            if response.status_code == 200:
                data = response.json()
                msg = data.get("message", "")
                print(f"  Success ({duration:.2f}s): {msg[:50]}...")
                if "trouble connecting" in msg:
                    print("  !!! FAIL: Fallback detected!")
            else:
                print(f"  Error {response.status_code} ({duration:.2f}s): {response.text}")
        except Exception as e:
            duration = time.time() - start
            print(f"  Exception ({duration:.2f}s): {e}")
        print("-" * 20)

if __name__ == "__main__":
    run_repro()
