import requests
import json
import time

url = "http://localhost:8000/chat"
session_id = f"test_quality_{int(time.time())}"

print("=" * 60)
print("TESTING RESPONSE QUALITY & ERROR HANDLING")
print("=" * 60)

def print_response(title, data):
    print(f"\n--- {title} ---")
    if "error" in data:
        print(f"❌ ERROR: {data['error']}")
        return False
        
    print(f"Stage: {data.get('stage')}")
    print(f"Urgency: {data.get('urgency')}")
    msg = data.get('message', '')
    print(f"Message preview: {msg[:100]}...")
    
    # Validation
    valid_urgency = data.get('urgency') in ["Low", "Moderate", "High"]
    has_content = len(msg) > 50
    
    if valid_urgency and has_content:
        print("✅ Status: PASS")
        return True
    else:
        print(f"❌ Status: FAIL (Urgency valid: {valid_urgency}, Content valid: {has_content})")
        return False

# Test 1: Medical Definition (Detailed)
print("\n1. Testing Medical Definition (Heart Attack)")
r1 = requests.post(url, json={
    "session_id": session_id,
    "message": "What is a heart attack?",
    "mode": "quick_triage"
})
data1 = r1.json()
print_response("Definition Response", data1)
msg1 = data1.get('message', '').lower()
if "causes" in msg1 and "symptoms" in msg1:
    print("   ✅ Contains detailed sections")
else:
    print("   ⚠️  Might be missing structured sections")

# Test 2: Symptom Assessment Closure (Acknowledgement)
# First set up some context
requests.post(url, json={
    "session_id": session_id, 
    "message": "I have a headache", 
    "mode": "quick_triage"
})
# Now send closure signal
print("\n2. Testing Closure (User says 'Okay')")
r2 = requests.post(url, json={
    "session_id": session_id,
    "message": "Okay",
    "mode": "quick_triage"
})
data2 = r2.json()
print_response("Closure Response", data2)

# Check if it didn't error out
if "no message received" not in data2.get('message', '').lower():
    print("   ✅ Handled 'Okay' without empty message error")
else:
    print("   ❌ Failed: Got empty message error")

print("\n" + "=" * 60)
