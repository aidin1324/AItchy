from typing import Annotated
from fastapi import APIRouter, Depends

from api.dependencies import get_emotion_service
from schemas.emotion import EmotionResponse
from schemas.emotion import EmotionCreate, EmotionUpdate
from services.emotion import EmotionService

router = APIRouter()

CommonEmotionService = Annotated[
    EmotionService,
    Depends(get_emotion_service)
]


@router.get(
    "/all",
    response_model=list[EmotionResponse],
    summary="Get all emotions",
    description="Retrieve information about all existing emotions",
)
async def get_all_emotions(emotion_service: CommonEmotionService):
    emotions = await emotion_service.get_all_emotion()
    return emotions


@router.get(
    "/by-id",
    response_model=EmotionResponse,
    summary="Get emotion by id",
    description="Retrieve information about a specific emotion",
)
async def get_emotion_by_id(
        emotion_id: int,
        emotion_service: CommonEmotionService
):
    emotion = await emotion_service.get_emotion_by_id(emotion_id)
    return emotion


@router.get(
    "/by-name",
    response_model=EmotionResponse,
    summary="Get emotion by name",
    description="Retrieve information about a specific emotion by name",
)
async def get_emotion_by_name(
        emotion_name: str,
        emotion_service: CommonEmotionService
):
    emotion = await emotion_service.get_emotion_by_name(emotion_name)
    return emotion


@router.post(
    "/create",
    response_model=EmotionResponse,
    summary="Create emotion",
    description="Create a new emotion",
)
async def create_emotion(
        emotion: EmotionCreate,
        emotion_service: CommonEmotionService
):
    emotion = await emotion_service.create_emotion(emotion)
    return emotion


@router.patch(
    "/update",
    response_model=EmotionResponse,
    summary="Update emotion",
    description="Update an existing emotion",
)
async def update_emotion(
        emotion_id: int,
        emotion_update: EmotionUpdate,
        emotion_service: CommonEmotionService
):
    emotion = await emotion_service.update_emotion(emotion_id, emotion_update)
    return emotion


@router.delete(
    "/delete",
    response_model=dict,
    summary="Delete emotion",
    description="Delete an existing emotion",
)
async def delete_emotion(
        emotion_id: int,
        emotion_service: CommonEmotionService
):
    detail = await emotion_service.delete_emotion(emotion_id)
    return detail
