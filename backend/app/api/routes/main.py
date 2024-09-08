from fastapi import APIRouter

from api.routes import authentication
from api.routes import notes
from api.routes import mood_content

api_router = APIRouter()

api_router.include_router(
    authentication.router,
    tags=['Authentication'],
    prefix="/auth"
)

api_router.include_router(
    notes.router,
    tags=['Notes'],
    prefix="/notes"
)

api_router.include_router(
    mood_content.router,
    tags=['Mood Content'],
    prefix="/mood-content"
)