import asyncio
import httpx
import time
from typing import Dict

BASE_URL = "http://localhost:8000"

async def test_response_time(query: str, expected_max_seconds: float) -> Dict:
    """Test a single query and measure response time."""
    start_time = time.time()
    
    payload = {
        "session_id": "test_session_123",
        "message": query,
        "mode": "quick_triage"
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{BASE_URL}/chat", json=payload, timeout=30.0)
            elapsed = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                status = "✅ PASS" if elapsed <= expected_max_seconds else "❌ FAIL"
                return {
                    "query": query,
                    "status": status,
                    "time": round(elapsed, 2),
                    "expected": expected_max_seconds,
                    "response_preview": data.get("message", "")[:100]
                }
            else:
                return {
                    "query": query,
                    "status": "❌ ERROR",
                    "time": round(elapsed, 2),
                    "expected": expected_max_seconds,
                    "response_preview": f"HTTP {response.status_code}"
                }
    except Exception as e:
        elapsed = time.time() - start_time
        return {
            "query": query,
            "status": "❌ ERROR",
            "time": round(elapsed, 2),
            "expected": expected_max_seconds,
            "response_preview": str(e)
        }

async def main():
    print("=" * 80)
    print("MedGPT Response Time Test")
    print("=" * 80)
    print()
    
    # Test cases: (query, max_expected_seconds)
    test_cases = [
        ("I have a headache", 5.0),
        ("What is diabetes?", 5.0),
        ("I have chest pain", 5.0),  # Emergency - should be fast
        ("Find hospitals in Mumbai", 5.0),
    ]
    
    results = []
    for query, max_time in test_cases:
        print(f"Testing: '{query}' (max: {max_time}s)...")
        result = await test_response_time(query, max_time)
        results.append(result)
        print(f"  {result['status']} - {result['time']}s")
        print()
        await asyncio.sleep(1)  # Small delay between requests
    
    # Summary
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    passed = sum(1 for r in results if r['status'] == "✅ PASS")
    total = len(results)
    
    for result in results:
        print(f"{result['status']} {result['query'][:40]:40} - {result['time']}s / {result['expected']}s")
    
    print()
    print(f"Passed: {passed}/{total}")
    
    if passed == total:
        print("🎉 All tests passed! Response times are under 5 seconds.")
    else:
        print("⚠️  Some tests failed. Response times need further optimization.")

if __name__ == "__main__":
    asyncio.run(main())
