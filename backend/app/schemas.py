from pydantic import BaseModel
from typing import Literal, Dict, Any

class ChatRequest(BaseModel):
    message: str
    session_id: str
    mode: str = "quick_triage"
    image: str | None = None  # Base64 encoded image
    mime_type: str | None = "image/jpeg"  # e.g., image/png, image/jpeg

class ChatResponse(BaseModel):
    stage: str
    urgency: Literal["Low", "Moderate", "High"]
    message: str
    confidence: float
    data: Dict[str, Any] | None = None  # Structured data (e.g., hospital lists)
