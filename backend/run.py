import sys
import os

# Ensure backend root is in sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

import uvicorn
from app.config import settings

if __name__ == "__main__":
    print(f"[Voxora AI] Starting Backend Engine on http://localhost:{settings.PORT}")
    print(f"[Voxora AI] API Documentation: http://localhost:{settings.PORT}/docs")
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
