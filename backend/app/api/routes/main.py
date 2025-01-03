from fastapi import APIRouter

from api.routes import authentication
from api.routes import notes
from api.routes import mood_content
from api.routes import context_factor
from api.routes import emotion
from api.routes import effect
from api.routes import mood_context
from api.routes import mood_emotion
from api.routes import mood_entry
from api.routes import analytics
from api.routes import openai_api

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

api_router.include_router(
    context_factor.router,
    tags=['Context Factor'],
    prefix="/context-factor"
)

api_router.include_router(
    emotion.router,
    tags=['Emotion'],
    prefix="/emotion"
)

api_router.include_router(
    effect.router,
    tags=['Effect'],
    prefix="/effect"
)

api_router.include_router(
    mood_context.router,
    tags=['Mood Context'],
    prefix="/mood-context"
)

api_router.include_router(
    mood_emotion.router,
    tags=['Mood Emotion'],
    prefix="/mood-emotion"
)

api_router.include_router(
    mood_entry.router,
    tags=['Mood Entry'],
    prefix="/mood-entry"
)

api_router.include_router(
    analytics.router,
    tags=['Analytics'],
    prefix="/analytics"
)

api_router.include_router(
    openai_api.router,
    tags=['OpenAI Api'],
    prefix="/entry-analyze"
)