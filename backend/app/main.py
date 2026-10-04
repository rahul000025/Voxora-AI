import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .config import settings
from .routers.tts import router as tts_router
from .services.tts_service import tts_service

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("voxora.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Voxora AI TTS Engine...")
    try:
        await tts_service.initialize()
        logger.info("Voxora AI TTS Engine is ready!")
    except Exception as e:
        logger.error(f"Error during TTS startup initialization: {e}")
    yield
    logger.info("Shutting down Voxora AI TTS Engine...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="High-performance, multi-language Neural Text-to-Speech API for Voxora AI.",
    lifespan=lifespan
)

# CORS configuration
origins = settings.CORS_ORIGINS
if "*" not in origins and "http://localhost:3000" not in origins:
    origins.append("http://localhost:3000")
if "http://127.0.0.1:3000" not in origins:
    origins.append("http://127.0.0.1:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if "*" not in origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition", "Content-Length", "X-Generated-By"]
)

# Register routes
app.include_router(tts_router)

@app.get("/", tags=["General"])
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs_url": "/docs",
        "health_url": "/health",
        "voices_url": "/api/voices"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
