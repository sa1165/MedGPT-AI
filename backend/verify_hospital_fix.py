import requests
import json

BASE_URL = "http://localhost:8000"

def test_hospital_search(city="Tirunelveli"):
    payload = {
        "message": f"List hospitals in {city}",
        "session_id": f"test_hospital_fix_{city.lower()}",
        "mode": "hospital_search"
    }
    try:
        print(f"\nSending hospital search request for {city}...")
        response = requests.post(f"{BASE_URL}/chat", json=payload)
        response.raise_for_status()
        data = response.json()
        
        hospital_data = data.get("data", {}).get("hospitals")
        message = data.get("message", "")
        
        if "Your actual response" in message:
            print(f"❌ FAIL: Placeholder text found in message for {city}!")
            return

        if isinstance(hospital_data, list) and len(hospital_data) > 0:
            print(f"✅ SUCCESS: Hospitals is a list for {city}!")
            for h in hospital_data:
                print(f" - {h.get('name')} (Map Query: {h.get('maps_query')})")
        else:
            print(f"❌ FAIL: Hospitals is still {type(hospital_data)} or empty for {city}")
            
    except Exception as e:
        print(f"Error for {city}: {e}")

if __name__ == "__main__":
    test_hospital_search("Tirunelveli")
    test_hospital_search("Mumbai")
    test_hospital_search("London")
