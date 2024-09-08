from typing import Annotated
from fastapi import APIRouter, Depends

from api.dependencies import get_mood_emotion_service
from schemas.mood_emotion import MoodEmotionResponse
from schemas.mood_emotion import MoodEmotionCreate, MoodEmotionUpdate
from services.mood_emotion import MoodEmotionService

router = APIRouter()

CommonMoodEmotionService = Annotated[
    MoodEmotionService,
    Depends(get_mood_emotion_service)
]


@router.get(
    "/all",
    response_model=list[MoodEmotionResponse],
    summary="Get all mood_emotions",
    description="Retrieve information about all existing mood_emotions",
)
async def get_all_mood_emotions(mood_emotion_service: CommonMoodEmotionService):
    mood_emotions = await mood_emotion_service.get_all_mood_emotion()
    return mood_emotions


@router.get(
    "/by-id",
    response_model=MoodEmotionResponse,
    summary="Get mood_emotion by id",
    description="Retrieve information about a specific mood_emotion",
)
async def get_mood_emotion_by_id(
        mood_emotion_id: int,
        mood_emotion_service: CommonMoodEmotionService
):
    mood_emotion = await mood_emotion_service.get_mood_emotion_by_id(mood_emotion_id)
    return mood_emotion


@router.post(
    "/create",
    response_model=MoodEmotionResponse,
    summary="Create mood_emotion",
    description="Create a new mood_emotion",
)
async def create_mood_emotion(
        mood_emotion: MoodEmotionCreate,
        mood_emotion_service: CommonMoodEmotionService
):
    mood_emotion = await mood_emotion_service.create_mood_emotion(mood_emotion)
    return mood_emotion


@router.patch(
    "/update",
    response_model=MoodEmotionResponse,
    summary="Update mood_emotion",
    description="Update an existing mood_emotion",
)
async def update_mood_emotion(
        mood_emotion_id: int,
        mood_emotion_update: MoodEmotionUpdate,
        mood_emotion_service: CommonMoodEmotionService
):
    mood_emotion = await mood_emotion_service.update_mood_emotion(mood_emotion_id, mood_emotion_update)
    return mood_emotion


@router.delete(
    "/delete",
    response_model=dict,
    summary="Delete mood_emotion",
    description="Delete an existing mood_emotion",
)
async def delete_mood_emotion(
        mood_emotion_id: int,
        mood_emotion_service: CommonMoodEmotionService
):
    detail = await mood_emotion_service.delete_mood_emotion(mood_emotion_id)
    return detail
