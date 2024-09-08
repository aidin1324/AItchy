from typing import Annotated
from fastapi import APIRouter, Depends

from api.dependencies import get_mood_context_service
from schemas.mood_context import MoodContextResponse
from schemas.mood_context import MoodContextCreate, MoodContextUpdate
from services.mood_context import MoodContextService

router = APIRouter()

CommonMoodContextService = Annotated[
    MoodContextService,
    Depends(get_mood_context_service)
]


@router.get(
    "/all",
    response_model=list[MoodContextResponse],
    summary="Get all mood_contexts",
    description="Retrieve information about all existing mood_contexts",
)
async def get_all_mood_contexts(mood_context_service: CommonMoodContextService):
    mood_contexts = await mood_context_service.get_all_mood_context()
    return mood_contexts


@router.get(
    "/by-id",
    response_model=MoodContextResponse,
    summary="Get mood_context by id",
    description="Retrieve information about a specific mood_context",
)
async def get_mood_context_by_id(
        mood_context_id: int,
        mood_context_service: CommonMoodContextService
):
    mood_context = await mood_context_service.get_mood_context_by_id(mood_context_id)
    return mood_context


@router.post(
    "/create",
    response_model=MoodContextResponse,
    summary="Create mood_context",
    description="Create a new mood_context",
)
async def create_mood_context(
        mood_context: MoodContextCreate,
        mood_context_service: CommonMoodContextService
):
    mood_context = await mood_context_service.create_mood_context(mood_context)
    return mood_context


@router.patch(
    "/update",
    response_model=MoodContextResponse,
    summary="Update mood_context",
    description="Update an existing mood_context",
)
async def update_mood_context(
        mood_context_id: int,
        mood_context_update: MoodContextUpdate,
        mood_context_service: CommonMoodContextService
):
    mood_context = await mood_context_service.update_mood_context(mood_context_id, mood_context_update)
    return mood_context


@router.delete(
    "/delete",
    response_model=dict,
    summary="Delete mood_context",
    description="Delete an existing mood_context",
)
async def delete_mood_context(
        mood_context_id: int,
        mood_context_service: CommonMoodContextService
):
    detail = await mood_context_service.delete_mood_context(mood_context_id)
    return detail
