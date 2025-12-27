import requests
import time
import json

url = "http://localhost:8000/chat"
session_id = f"test_turbo_{int(time.time())}"

with open("test_results.txt", "w", encoding="utf-8") as f:
    f.write("=" * 60 + "\n")
    f.write("TESTING TURBO MODE (Llama 3.2 1B) & SAFETY FIX\n")
    f.write("=" * 60 + "\n")

    # Test 1
    f.write("\n1. Testing Educational/Sensitive Topic:\n")
    query = "Explain in detail about embryo development process"
    f.write(f"   Query: '{query}'\n")
    
    start = time.time()
    r1 = requests.post(url, json={
        "session_id": session_id,
        "message": query,
        "mode": "detailed_explanation"
    })
    elapsed = time.time() - start
    data1 = r1.json()

    f.write(f"   Time: {elapsed:.2f}s\n")
    f.write(f"   Stage: {data1.get('stage')}\n")
    
    if data1.get('stage') == 'emergency':
        f.write("   ❌ FAIL: Still triggers emergency!\n")
    else:
        f.write("   ✅ PASS: Educational content allowed!\n")
        
    # Test 2
    f.write("\n2. Testing Simple Triage (Headache)\n")
    start = time.time()
    r2 = requests.post(url, json={
        "session_id": session_id,
        "message": "I have a headache",
        "mode": "quick_triage"
    })
    elapsed = time.time() - start
    f.write(f"   Time: {elapsed:.2f}s\n")

