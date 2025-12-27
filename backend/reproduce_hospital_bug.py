import asyncio
import os
import sys

# Add the current directory to sys.path so we can import app
sys.path.append(os.getcwd())

from app.core.llm import get_llm_response

async def test_hospital_search():
    print("Testing Hospital Search in 'hospital_search' mode...")
    try:
        response = await get_llm_response([], "List major hospitals and emergency centers in London.", mode="hospital_search")
        print("Response (hospital_search mode):")
        print(response)
    except Exception as e:
        print(f"Error in hospital_search mode: {e}")

    print("\nTesting Hospital Search in 'quick_triage' mode...")
    try:
        response = await get_llm_response([], "List major hospitals and emergency centers in London.", mode="quick_triage")
        print("Response (quick_triage mode):")
        print(response)
    except Exception as e:
        print(f"Error in quick_triage mode: {e}")

if __name__ == "__main__":
    asyncio.run(test_hospital_search())
