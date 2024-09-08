

from typing import Annotated
from fastapi import APIRouter, Depends

from api.dependencies import get_mood_content_service
from schemas.mood_content import MoodContentResponse
from schemas.mood_content import MoodContentCreate
from services.mood_content import MoodContentService


router = APIRouter()

CommonMoodContentService = Annotated[MoodContentService, Depends(get_mood_content_service)]


@router.get(
    "/all",
    response_model=list[MoodContentResponse],
    summary="Get all moods",
    description="Retrieve information about all existing moods",
)
async def get_all_moods(mood_content_service: CommonMoodContentService):
    moods = await mood_content_service.get_moods()
    return moods


@router.get(
    "/by-id",
    response_model=MoodContentResponse,
    summary="Get mood by id",
    description="Retrieve information about a specific mood",
)
async def get_mood_by_id(mood_id: int, mood_content_service: CommonMoodContentService):
    mood = await mood_content_service.get_mood_by_id(mood_id)
    return mood


@router.get(
    "/by-type",
    response_model=MoodContentResponse,
    summary="Get mood by type",
    description="Retrieve information about a specific mood by type",
)
async def get_mood_by_type(mood_type: str, mood_content_service: CommonMoodContentService):
    mood = await mood_content_service.get_mood_by_type(mood_type)
    return mood


@router.post(
    "/create",
    response_model=MoodContentResponse,
    summary="Create mood",
    description="Create a new mood",
)
async def create_mood(mood: MoodContentCreate, mood_content_service: CommonMoodContentService):
    mood = await mood_content_service.create_mood(mood)
    return mood


@router.patch(
    "/update",
    response_model=MoodContentResponse,
    summary="Update mood",
    description="Update an existing mood",
)
async def update_mood(mood_id: int, mood_update: MoodContentCreate, mood_content_service: CommonMoodContentService):
    mood = await mood_content_service.update_mood(mood_id, mood_update)
    return mood


@router.delete(
    "/delete",
    response_model=dict,
    summary="Delete mood",
    description="Delete an existing mood",
)
async def delete_mood(mood_id: int, mood_content_service: CommonMoodContentService):
    detail = await mood_content_service.delete_mood(mood_id)
    return detail