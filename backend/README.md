# Voxora AI - Backend Service

High-performance, production-ready Neural Text-to-Speech API powered by FastAPI and `edge-tts`.

## Features
- **Neural Voice Synthesis**: Powered by Microsoft Edge Neural TTS (supporting 300+ voices across 100+ languages including Hindi, English, Spanish, French, German, Japanese, and more).
- **Audio Output**: Direct high-quality MP3 streaming (`audio/mpeg`).
- **Pitch, Rate & Volume Controls**: Fine-tune speaking speed (-50% to +100%), pitch (-50Hz to +50Hz), and volume (-50% to +50%).
- **Voice Caching & Discovery**: Pre-caches available voices with language and gender filters.
- **Voice Previews**: Instant 2-3 second voice samples for quick auditioning.
- **CORS Enabled**: Configured for Next.js frontend communication.
- **Input Validation**: Enforces length constraints, prevents empty payloads, handles network retries.

## Quick Start

### 1. Create a Python Virtual Environment
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Server
```bash
uvicorn app.main:app --reload --port 8000
```
Or run directly:
```bash
python -m app.main
```

The API will be available at:
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)
- **Voices Endpoint**: [http://localhost:8000/api/voices](http://localhost:8000/api/voices)
- **TTS Generation**: `POST http://localhost:8000/api/tts`
