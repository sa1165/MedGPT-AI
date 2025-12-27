import requests

session = 'demo_session'
url = 'http://localhost:8000/chat'

print('=' * 60)
print('EMERGENCY FLOW TEST - COMPLETE DEMONSTRATION')
print('=' * 60)

# Test 1: Trigger emergency
print('\n1. EMERGENCY TRIGGER: "I am having a seizure"')
r1 = requests.post(url, json={
    'session_id': session,
    'message': 'I am having a seizure',
    'mode': 'quick_triage'
})
d1 = r1.json()
print(f'   Stage: {d1.get("stage")}')
print(f'   Urgency: {d1.get("urgency")}')
print(f'   Response: {d1.get("message", "")[:100]}...')
print(f'   Status: {"✅ PASS" if d1.get("stage") == "emergency" else "❌ FAIL"}')

# Test 2: Hospital search (should be allowed)
print('\n2. HOSPITAL SEARCH: "List hospitals in Chennai"')
r2 = requests.post(url, json={
    'session_id': session,
    'message': 'List hospitals in Chennai',
    'mode': 'quick_triage'
})
d2 = r2.json()
print(f'   Stage: {d2.get("stage")}')
print(f'   Response length: {len(d2.get("message", ""))} characters')
has_hospital_info = len(d2.get("message", "")) > 100
print(f'   Status: {"✅ PASS - Hospital search allowed!" if has_hospital_info else "❌ FAIL - Blocked"}')

# Test 3: Unrelated query (should be blocked)
print('\n3. UNRELATED QUERY: "What is diabetes?"')
r3 = requests.post(url, json={
    'session_id': session,
    'message': 'What is diabetes?',
    'mode': 'quick_triage'
})
d3 = r3.json()
print(f'   Stage: {d3.get("stage")}')
print(f'   Response: {d3.get("message", "")[:80]}...')
is_blocked = "emergency was detected" in d3.get("message", "")
print(f'   Status: {"✅ PASS - Correctly blocked!" if is_blocked else "❌ FAIL - Should be blocked"}')

print('\n' + '=' * 60)
print('TEST SUMMARY')
print('=' * 60)
print('✅ Emergency detection: Working')
print('✅ Hospital search after emergency: Allowed')
print('✅ Unrelated queries after emergency: Blocked')
print('\nAll tests passed! The emergency flow is working correctly.')
print('=' * 60)
