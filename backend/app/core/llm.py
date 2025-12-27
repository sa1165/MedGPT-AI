import os
import json
import httpx
import re
import asyncio
import time
from typing import Optional, Dict, Any, AsyncGenerator
from app.core.prompt import get_system_prompt
from dotenv import load_dotenv

load_dotenv()

# Environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

# Circuit breaker for Gemini Quota
gemini_disabled_until = 0.0

# Persistent client for connection pooling
http_client = httpx.AsyncClient(timeout=120.0)

def ensure_json_response(text: str) -> str:
    """Enforce JSON output structure using regex."""
    if not text:
        return ""
    
    # Robust extraction: Find first '{' and last '}'
    start_idx = text.find('{')
    end_idx = text.rfind('}')

    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
        potential_json = text[start_idx : end_idx + 1]
        try:
            json.loads(potential_json)
            return potential_json
        except json.JSONDecodeError:
            pass
        
    return json.dumps({
        "stage": "interview",
        "urgency": "Low",
        "message": text.strip(),
        "confidence": 0.5
    })

async def call_gemini_stream(messages: list[Dict[str, str]], mode: str = "quick_triage", image: Optional[str] = None, mime_type: str = "image/jpeg") -> AsyncGenerator[str, None]:
    """Call Google Gemini 2.0 Flash via REST API with streaming."""
    global gemini_disabled_until
    
    if not GEMINI_API_KEY:
        yield "Error: Gemini API Key missing"
        return
    
    if time.time() < gemini_disabled_until:
        print("DEBUG: Gemini disabled due to circuit breaker")
        yield "ERROR: QUOTA_EXCEEDED"
        return

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key={GEMINI_API_KEY}"
    
    gemini_contents = []
    for i, msg in enumerate(messages):
        role = "user" if msg["role"] == "user" else "model"
        parts = []
        if i == len(messages) - 1 and image:
             parts.append({"inline_data": {"mime_type": mime_type, "data": image}})
        parts.append({"text": msg["content"]})
        gemini_contents.append({"role": role, "parts": parts})
        
    payload = {
        "contents": gemini_contents,
        "system_instruction": {"parts": [{"text": get_system_prompt(mode)}]},
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 1500
        }
    }

    start_time = time.time()
    first_token_received = False

    try:
        async with http_client.stream("POST", url, json=payload, timeout=httpx.Timeout(5.0, connect=2.0)) as response:
            if response.status_code == 429:
                print("DEBUG: Gemini Quota Exceeded. Disabling for 5 minutes.")
                gemini_disabled_until = time.time() + 300 # 5 minutes
                yield "ERROR: QUOTA_EXCEEDED"
                return
            response.raise_for_status()
            
            async for line in response.aiter_lines():
                if not line or line.strip() in ["[", "]", ","]:
                    continue
                if line.startswith(','):
                    line = line[1:]
                
                try:
                    chunk = json.loads(line)
                    if "candidates" in chunk:
                        text = chunk["candidates"][0]["content"]["parts"][0]["text"]
                        if not first_token_received:
                            ttft = (time.time() - start_time) * 1000
                            print(f"DEBUG: Gemini TTFT: {ttft:.2f}ms")
                            first_token_received = True
                        yield text
                except: continue
    except Exception as e:
        print(f"Gemini Stream Error: {e}")
        yield "ERROR: GEMINI_FAIL"

async def call_ollama_stream(messages: list[Dict[str, str]], mode: str = "quick_triage", image: Optional[str] = None) -> AsyncGenerator[str, None]:
    """Call Ollama with streaming and telemetry."""
    url = f"{OLLAMA_BASE_URL}/api/chat"
    ollama_messages = [{"role": "system", "content": get_system_prompt(mode)}]
    
    for i, msg in enumerate(messages):
        message_payload = {"role": msg["role"], "content": msg["content"]}
        if i == len(messages) - 1 and image and msg["role"] == "user":
             message_payload["images"] = [image]
        ollama_messages.append(message_payload)

    payload = {
        "model": "llama3.2:1b",
        "messages": ollama_messages,
        "stream": True,
        "keep_alive": "60m",
        "options": {"temperature": 0.3, "num_ctx": 4096}
    }
    
    if mode == "hospital_search":
        payload["format"] = "json"

    start_time = time.time()
    first_token_received = False

    try:
        async with http_client.stream("POST", url, json=payload, timeout=60.0) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if not line: continue
                try:
                    chunk = json.loads(line)
                    if "message" in chunk and "content" in chunk["message"]:
                        if not first_token_received:
                            ttft = (time.time() - start_time) * 1000
                            print(f"DEBUG: Ollama TTFT: {ttft:.2f}ms")
                            first_token_received = True
                        yield chunk["message"]["content"]
                    if chunk.get("done"): break
                except: continue
    except Exception as e:
        print(f"Ollama Stream Error: {e}")
        yield "ERROR: OLLAMA_FAIL"

async def get_llm_response_stream(conversation_history: list[Dict[str, str]], user_message: str, mode: str = "quick_triage", image: Optional[str] = None, mime_type: str = "image/jpeg") -> AsyncGenerator[str, None]:
    """Orchestrates streaming LLM calls with fallback."""
    messages = conversation_history + [{"role": "user", "content": user_message}]
    
    # Try Gemini Stream (unless disabled)
    is_fallback = False
    
    # Fast check for circuit breaker before entering generator loop
    if time.time() > gemini_disabled_until:
        async for chunk in call_gemini_stream(messages, mode=mode, image=image, mime_type=mime_type):
            if chunk == "ERROR: QUOTA_EXCEEDED" or chunk == "ERROR: GEMINI_FAIL":
                is_fallback = True
                break
            yield chunk
    else:
        is_fallback = True
        
    if is_fallback:
        print("Falling back to Ollama Stream...")
        async for chunk in call_ollama_stream(messages, mode=mode, image=image):
            if chunk == "ERROR: OLLAMA_FAIL":
                yield "I'm having trouble connecting to my local backup. Please try again."
                break
            yield chunk

# Keep original for non-streaming compatibility if needed
async def get_llm_response(conversation_history: list[Dict[str, str]], user_message: str, mode: str = "quick_triage", image: Optional[str] = None, mime_type: str = "image/jpeg") -> str:
    full_response = ""
    async for chunk in get_llm_response_stream(conversation_history, user_message, mode, image, mime_type):
        full_response += chunk
    return ensure_json_response(full_response)
