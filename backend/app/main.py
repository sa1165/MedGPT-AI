import json
import logging
import sys
import time
from typing import Dict, List
from collections import defaultdict
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from app.schemas import ChatRequest, ChatResponse
from app.core.llm import get_llm_response
from app.core.state import get_session_state

# --- Configuration ---
# Simple in-memory state for demonstration, in prod use Redis/DB
session_store = {}

# --- Logging Setup ---
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO,
    stream=sys.stdout
)
logger = logging.getLogger("MedGPT")

# --- Rate Limiter ---
class RateLimiter:
    def __init__(self, limit=10, window=60):
        self.limit = limit
        self.window = window
        self.requests: Dict[str, List[float]] = defaultdict(list)

    def is_allowed(self, key: str) -> bool:
        now = time.time()
        # Filter out old timestamps
        self.requests[key] = [t for t in self.requests[key] if now - t < self.window]
        if len(self.requests[key]) >= self.limit:
            return False
        self.requests[key].append(now)
        return True

limiter = RateLimiter(limit=15, window=60) # 15 requests per minute

from fastapi.middleware.cors import CORSMiddleware

# from app.core.llm import call_ollama

app = FastAPI(title="MedGPT Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Endpoints ---

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}

from fastapi.responses import StreamingResponse
from app.core.llm import get_llm_response_stream, ensure_json_response

@app.post("/chat/stream")
async def chat_stream_endpoint(request: ChatRequest):
    """Streaming endpoint for faster perceived response."""
    # Rate check
    if not limiter.is_allowed(request.session_id):
        async def rate_limit_gen():
            yield json.dumps({"message": "You are sending messages too quickly. Please wait.", "stage": "interview", "urgency": "Low"})
        return StreamingResponse(rate_limit_gen(), media_type="text/event-stream")

    history = session_store.get(request.session_id, [])
    
    async def stream_generator():
        # --- STRICT INTERCEPTION FOR QUICK ACTION ---
        if not history and request.message.strip().lower() == "can you explain this simply?":
            response_text = "yes i would love to explain things in short and easily understandable way what is the thing you need explanation with?"
            yield response_text
            
            # Record in history
            history.append({"role": "user", "content": request.message})
            history.append({"role": "assistant", "content": response_text})
            session_store[request.session_id] = history
            
            # Send completion metadata
            yield f"\nMETADATA:{json.dumps({'urgency': 'Low', 'stage': 'interview', 'data': None})}"
            return
        # ---------------------------------------------

        full_content = ""
        is_json_suppressed = False
        
        # 1. Start streaming from LLM
        async for chunk in get_llm_response_stream(
            history, 
            request.message, 
            mode=request.mode, 
            image=request.image, 
            mime_type=request.mime_type
        ):
            full_content += chunk
            
            # --- FIRST-BRACE INTERCEPTOR ---
            # If we detect a '{', we assume a JSON block has started and stop yielding to user.
            if not is_json_suppressed:
                if "{" in full_content:
                    is_json_suppressed = True
                    # Yield everything PRIOR to the '{'
                    previously_yielded_len = len(full_content) - len(chunk)
                    tag_index = full_content.find("{")
                    if tag_index > previously_yielded_len:
                        yield full_content[previously_yielded_len:tag_index]
                    continue

            if not is_json_suppressed:
                yield chunk

        # 2. After stream finishes, parse for metadata and update history
        # Robustly extract JSON even if tags are present
        final_json_str = ensure_json_response(full_content)
        try:
            parsed = json.loads(final_json_str)
            message_content = parsed.get("message") or parsed.get("response") or "Internal processing error."
            
            # Handle summary formatted responses (DeepSeek style)
            if parsed.get("stage") == "summary" and "summary" in parsed:
                summary_data = parsed["summary"]
                if isinstance(summary_data, dict):
                    formatted_summary = "\n\n"
                    for section, content in summary_data.items():
                        formatted_summary += f"**{section}**\n"
                        if isinstance(content, dict):
                            for key, value in content.items():
                                formatted_summary += f"- **{key}**: {value}\n"
                        else:
                            formatted_summary += f"{content}\n"
                        formatted_summary += "\n"
                    message_content += formatted_summary

            history.append({"role": "user", "content": request.message})
            history.append({"role": "assistant", "content": message_content})
            session_store[request.session_id] = history
            
            # We also send the final metadata as a special JSON chunk at the end
            # This allows the frontend to update urgency/stage
            yield f"\nMETADATA:{json.dumps({'urgency': parsed.get('urgency', 'Low'), 'stage': parsed.get('stage', 'interview'), 'data': parsed.get('data')})}"
            
        except Exception as e:
            logger.error(f"Stream finalizing error: {e}")

    return StreamingResponse(stream_generator(), media_type="text/event-stream")

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    start_time = time.time()
    
    # 1. Rate Check
    if request.image:
        print(f"DEBUG: Endpoint received image. Size: {len(request.image)} chars. Mime: {request.mime_type}")
    else:
        print("DEBUG: No image in request.")

    if not limiter.is_allowed(request.session_id):
        logger.warning(json.dumps({
            "event": "rate_limit_exceeded",
            "session_id": request.session_id,
        }))
        # Return a polite error equivalent to a ChatResponse or 429
        # Per requirement "Return safe fallback" and "Return a polite error message".
        # We can return a ChatResponse explaining the limit, or HTTP 429.
        # Let's return a ChatResponse to keep the frontend simple if possible, 
        # but 429 is semantically correct. Prompt says "Return a polite error message if exceeded".
        # Let's stick effectively to a 429 but json body or just a ChatResponse?
        # A ChatResponse allows the UI to show it as a message.
        return ChatResponse(
            stage="interview",
            urgency="Low",
            message="You are sending messages too quickly. Please wait a moment before trying again.",
            confidence=0.0
        )


    # 2. Retrieve conversation history
    history = session_store.get(request.session_id, [])
    
    # 2a. Check if session is in emergency state
    # If in emergency state, only allow hospital search or new session
    is_emergency_session = False
    if history:
        last_assistant_msg = next((msg for msg in reversed(history) if msg["role"] == "assistant"), None)
        if last_assistant_msg and "STAGE: emergency" in last_assistant_msg.get("content", ""):
            is_emergency_session = True
            
            # Check if user is asking for hospital/help - allow this
            user_msg_lower = request.message.lower()
            hospital_keywords = ["hospital", "emergency", "doctor", "clinic", "medical center", "help", "where"]
            is_seeking_help = any(keyword in user_msg_lower for keyword in hospital_keywords)
            
            if not is_seeking_help:
                # Block non-help queries after emergency
                return ChatResponse(
                    stage="emergency",
                    urgency="High",
                    message="⚠️ An emergency was detected in this conversation. Please seek immediate medical attention by calling emergency services or visiting the nearest hospital.\n\nIf you need to find nearby hospitals, please ask 'Find hospitals near me' or start a new chat for other questions.",
                    confidence=0.0
                )
            else:
                # User is seeking help - switch to hospital_search mode
                request.mode = "hospital_search"

    # 2b. Auto-detect hospital search mode if not already set
    hospital_keywords = ["hospital", "emergency center", "medical center", "clinic", "where is the nearest", "hospitals in"]
    if request.mode != "hospital_search" and any(keyword in request.message.lower() for keyword in hospital_keywords):
        logger.info(f"Auto-switching to hospital_search mode for session {request.session_id}")
        request.mode = "hospital_search"


    # 3. Get LLM response with Timeout/Error Handling
    try:
        # get_llm_response internally handles generic exceptions and returns a JSON error string
        # but we wrap it here to catch any unexpected runtime errors in the orchestration layer
        llm_raw_response = await get_llm_response(history, request.message, mode=request.mode, image=request.image, mime_type=request.mime_type)
    except Exception as e:
        logger.error(json.dumps({
            "event": "llm_error",
            "element": "execution_fail",
            "error": str(e),
            "session_id": request.session_id
        }))
        return ChatResponse(
            stage="interview",
            urgency="Low",
            message="I'm having trouble connecting right now. Please try again in a moment.",
            confidence=0.0
        )
    
    try:
        # 4. Parse JSON
        # The llm_raw_response should already be cleaned by ensure_json_response
        parsed_response = json.loads(llm_raw_response)
        
        # DEBUG: Write parsed response to file
        with open("debug_response.txt", "w") as f:
            f.write(json.dumps(parsed_response, indent=2))
        
        # 5. Context & History Update
        message_content = (
            parsed_response.get("message") or 
            parsed_response.get("response") or 
            parsed_response.get("text")
        )

        # Fallback: If no standard key, find the first string value (helpful for small models failing JSON structure)
        if not message_content:
            for value in parsed_response.values():
                if isinstance(value, str) and len(value) > 20: # Likely the response
                    message_content = value
                    break
        
        if not message_content:
            message_content = "I apologize, but I'm having trouble formulating a response. Could you rephrase your question?"
        
        # Validate and fix urgency
        urgency = parsed_response.get("urgency", "Low")
        if urgency not in ["Low", "Moderate", "High"]:
            urgency = "Low"  # Default to Low if invalid or None

        # Handle "summary" field if present (LLM often puts it in a separate object)
        if parsed_response.get("stage") == "summary" and "summary" in parsed_response:
            summary_data = parsed_response["summary"]
            if isinstance(summary_data, dict):
                formatted_summary = "\n\n"
                for section, content in summary_data.items():
                    formatted_summary += f"**{section}**\n"
                    if isinstance(content, dict):
                        for key, value in content.items():
                            formatted_summary += f"- **{key}**: {value}\n"
                    else:
                        formatted_summary += f"{content}\n"
                    formatted_summary += "\n"
                message_content += formatted_summary
        
        assistant_context = message_content
        
        history.append({"role": "user", "content": request.message})
        history.append({"role": "assistant", "content": assistant_context})
        session_store[request.session_id] = history

        # 6. Logging
        logger.info(json.dumps({
            "event": "chat_completion",
            "session_id": request.session_id,
            "stage": parsed_response.get("stage"),
            "urgency": parsed_response.get("urgency"),
            "duration_ms": round((time.time() - start_time) * 1000, 2)
        }))

        # 7. Emergency Lock
        if parsed_response.get("stage") == "emergency":
            return ChatResponse(
                stage="emergency",
                urgency="High",
                message=parsed_response["message"],
                confidence=parsed_response.get("confidence", 0.0)
            )

        # 8. Data Sanitization (Fix for stringified hospital list)
        data = parsed_response.get("data")
        if data and data.get("type") == "hospital_list" and isinstance(data.get("hospitals"), str):
            try:
                data["hospitals"] = json.loads(data["hospitals"])
                logger.info("Successfully parsed stringified hospital list into JSON array.")
            except Exception as e:
                logger.error(f"Failed to parse stringified hospital list: {e}")

        return ChatResponse(
            stage=parsed_response.get("stage", "interview"),
            urgency=parsed_response.get("urgency", "Low"),
            message=message_content,
            confidence=parsed_response.get("confidence", 0.0),
            data=data
        )
        
    except json.JSONDecodeError:
        logger.error(json.dumps({
            "event": "json_parse_error",
            "session_id": request.session_id,
            "raw_response": llm_raw_response[:200]
        }))
        return ChatResponse(
            stage="interview",
            urgency="Low", 
            message="Internal processing error. Please repeat.",
            confidence=0.0
        )
    except Exception as e:
        logger.error(json.dumps({
            "event": "system_error",
            "session_id": request.session_id,
            "error": str(e)
        }))
        # Graceful fallback instead of 500
        return ChatResponse(
            stage="interview",
            urgency="Low",
            message="An unexpected error occurred. Please try again.",
            confidence=0.0
        )

# --- Serve Frontend (For Deployment) ---
from fastapi.staticfiles import StaticFiles
import os

# Check if static directory exists (created during Docker build)
if os.path.exists("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="static")
