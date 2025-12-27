
import re
import json

def ensure_json_response(text: str) -> str:
    """Current implementation from llm.py"""
    if not text:
        return ""
    
    try:
        # Look for content between first { and last } - CURRENT BUGGY REGEX
        match = re.search(r'(\{.*?\})', text, re.DOTALL)
        if match:
            candidate = match.group(1)
            print(f"Regex extracted: {candidate}")
            json.loads(candidate)
            return candidate
    except json.JSONDecodeError as e:
        print(f"JSON Parsing Failed: {e}")
        return None
    return None

# Test case 1: Simple JSON (Should work)
simple_json = 'Here is your response: {"message": "Hello"}'
print(f"\n--- Test 1: Simple JSON ---\nInput: {simple_json}")
result = ensure_json_response(simple_json)
print(f"Result: {result}")

# Test case 2: Nested JSON (Should fail with current regex)
nested_json = '{"stage": "interview", "data": {"nested": "value"}}'
print(f"\n--- Test 2: Nested JSON ---\nInput: {nested_json}")
result = ensure_json_response(nested_json)
print(f"Result: {result}")

# Test case 3: JSON with newlines (Should work mostly)
multiline_json = """
{
  "stage": "interview",
  "message": "Hello there"
}
"""
print(f"\n--- Test 3: Multiline JSON ---\nInput: {multiline_json}")
result = ensure_json_response(multiline_json)
print(f"Result: {result}")
