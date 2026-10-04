from typing import List, Optional, Union
from pydantic import BaseModel, Field, field_validator

class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Text to synthesize into speech")
    voice: str = Field(default="en-US-JennyNeural", description="Voice identifier (e.g., en-US-JennyNeural or hi-IN-SwaraNeural)")
    rate: Union[int, float, str] = Field(default=0, description="Speech rate adjustment (-50% to +100%)")
    pitch: Union[int, float, str] = Field(default=0, description="Voice pitch adjustment in Hz (-50Hz to +50Hz)")
    volume: Union[int, float, str] = Field(default=0, description="Volume level adjustment (-50% to +50%)")

    @field_validator("text")
    def validate_text(cls, v: str) -> str:
        clean = v.strip()
        if not clean:
            raise ValueError("Text cannot be empty or contain only whitespace.")
        return clean

class VoicePreviewRequest(BaseModel):
    voice: str = Field(..., description="Voice identifier to preview")
    custom_text: Optional[str] = Field(default=None, description="Optional custom text for preview")

class VoiceItem(BaseModel):
    short_name: str
    friendly_name: str
    gender: str
    locale: str
    language: str
    sample_rate: Optional[str] = None
    is_featured: bool = False
    preview_text: str = "Hello, this is a sample of my voice generated with Voxora AI."

class VoicesResponse(BaseModel):
    voices: List[VoiceItem]
    total: int
    featured: List[VoiceItem]
    languages: List[str]

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    voices_loaded: int
