import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Response, status
from fastapi.responses import JSONResponse
from ..models import TTSRequest, VoicePreviewRequest, VoicesResponse, HealthResponse
from ..services.tts_service import tts_service
from ..config import settings

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    """System health check endpoint."""
    voices = tts_service.get_voices()
    return HealthResponse(
        status="healthy",
        service=settings.PROJECT_NAME,
        version=settings.VERSION,
        voices_loaded=len(voices)
    )

@router.get("/api/voices", response_model=VoicesResponse, tags=["Voices"])
async def get_voices(
    language: Optional[str] = Query(None, description="Filter by language (e.g., Hindi, English)"),
    gender: Optional[str] = Query(None, description="Filter by gender (Female or Male)"),
    search: Optional[str] = Query(None, description="Search voice by name or code"),
    featured: Optional[bool] = Query(False, description="Filter featured voices only")
):
    """
    List available neural voices with optional filtering by language, gender, and search query.
    """
    try:
        voices = tts_service.get_voices(
            language=language,
            gender=gender,
            search=search,
            featured_only=featured or False
        )
        featured_voices = tts_service.get_featured_voices()
        languages = tts_service.get_languages()

        return VoicesResponse(
            voices=voices,
            total=len(voices),
            featured=featured_voices,
            languages=languages
        )
    except Exception as e:
        logger.error(f"Failed to fetch voices: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve voice list: {str(e)}"
        )

@router.post("/api/tts", tags=["TTS"])
async def synthesize_speech(request: TTSRequest):
    """
    Synthesize text into MP3 neural speech.
    Returns audio/mpeg binary stream.
    """
    if len(request.text) > settings.MAX_TEXT_LENGTH:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Text exceeds maximum allowed length of {settings.MAX_TEXT_LENGTH} characters."
        )

    try:
        audio_bytes = await tts_service.generate_speech(request)
        
        return Response(
            content=audio_bytes,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "inline; filename=voxora-speech.mp3",
                "Content-Length": str(len(audio_bytes)),
                "Cache-Control": "no-cache",
                "X-Generated-By": "Voxora-AI"
            }
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Synthesis failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Speech synthesis error: {str(e)}"
        )

@router.post("/api/preview", tags=["TTS"])
async def preview_voice(preview_req: VoicePreviewRequest):
    """
    Generate a quick 2-3 second voice sample for testing and voice preview.
    """
    try:
        audio_bytes = await tts_service.generate_preview(
            voice_name=preview_req.voice,
            custom_text=preview_req.custom_text
        )
        return Response(
            content=audio_bytes,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "inline; filename=voice-preview.mp3",
                "Content-Length": str(len(audio_bytes)),
                "Cache-Control": "public, max-age=3600"
            }
        )
    except Exception as e:
        logger.error(f"Preview synthesis failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Voice preview failed: {str(e)}"
        )
