import requests
import json

url = "http://localhost:8000/chat"
session_id = "emergency_test_session"

print("=" * 60)
print("Testing Emergency + Hospital Search Flow")
print("=" * 60)

# Step 1: Trigger emergency
print("\n1. Triggering emergency with 'seizure'...")
response1 = requests.post(url, json={
    "session_id": session_id,
    "message": "I'm having a seizure",
    "mode": "quick_triage"
})

if response1.status_code == 200:
    data1 = response1.json()
    print(f"   Stage: {data1.get('stage')}")
    print(f"   Urgency: {data1.get('urgency')}")
    print(f"   Message: {data1.get('message', '')[:100]}...")
    print(f"   ✅ Emergency detected" if data1.get('stage') == 'emergency' else "   ❌ Not emergency")

# Step 2: Try to ask for hospitals (should work now)
print("\n2. Asking for hospitals in Chennai...")
response2 = requests.post(url, json={
    "session_id": session_id,
    "message": "List major hospitals in Chennai",
    "mode": "quick_triage"
})

if response2.status_code == 200:
    data2 = response2.json()
    print(f"   Stage: {data2.get('stage')}")
    print(f"   Urgency: {data2.get('urgency')}")
    print(f"   Message preview: {data2.get('message', '')[:150]}...")
    print(f"   ✅ Hospital search allowed!" if "hospital" in data2.get('message', '').lower() else "   ❌ Blocked")

# Step 3: Try unrelated query (should be blocked)
print("\n3. Trying unrelated query 'What is diabetes?'...")
response3 = requests.post(url, json={
    "session_id": session_id,
    "message": "What is diabetes?",
    "mode": "quick_triage"
})

if response3.status_code == 200:
    data3 = response3.json()
    print(f"   Stage: {data3.get('stage')}")
    print(f"   Message preview: {data3.get('message', '')[:100]}...")
    print(f"   ✅ Correctly blocked!" if "emergency was detected" in data3.get('message', '') else "   ❌ Should have been blocked")

print("\n" + "=" * 60)
print("Test complete!")
print("=" * 60)
