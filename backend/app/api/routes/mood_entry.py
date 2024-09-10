from datetime import date
from typing import Annotated
from fastapi import APIRouter, Depends, Query
from fastapi.security import OAuth2PasswordBearer

from api.dependencies import get_mood_entry_service, get_auth_service
from schemas.mood_entry import MoodEntryResponse
from schemas.mood_entry import MoodEntryCreate, MoodEntryUpdate
from services.authentication import AuthenticationService
from services.mood_entry import MoodEntryService
from schemas.pagination import PaginatedResponse

from models.user import User

router = APIRouter()

oauth2_scheme_user = OAuth2PasswordBearer(tokenUrl="auth/login/user", scheme_name="user")

CommonAuthService = Annotated[
    AuthenticationService,
    Depends(get_auth_service)
]

CommonMoodEntryService = Annotated[
    MoodEntryService,
    Depends(get_mood_entry_service)
]


@router.get(
    "/by-id",
    response_model=MoodEntryResponse,
    summary="Get mood_entry by id",
    description="Retrieve information about a specific mood_entry",
)
async def get_mood_entry_by_id(
        mood_entry_id: int,
        mood_entry_service: CommonMoodEntryService
):
    mood_entry = await mood_entry_service.get_mood_entry_by_id(mood_entry_id)
    return mood_entry


@router.get(
    "/by-date",
    response_model=PaginatedResponse[MoodEntryResponse],
    summary="Get mood_entries by date",
    description="Retrieve information about mood_entries by date with pagination",
)
async def get_mood_entries_by_date(
        auth_service: CommonAuthService,
        mood_entries_service: CommonMoodEntryService,
        token: str = Depends(oauth2_scheme_user),
        start_date: date | None = None,
        end_date: date | None = None,
        last_id: int | None = Query(None, description="Cursor for pagination"),
        limit: int = Query(10, description="Number of mood_entries to retrieve per page")
):
    user: User = await auth_service.get_current_user(token)
    paginated_mood_entries = await mood_entries_service.get_paginated_mood_entries_by_user_id_by_date(
        user_id=user.id,
        start_date=start_date,
        end_date=end_date,
        cursor=last_id,
        limit=limit
    )
    return paginated_mood_entries


@router.post(
    "/create",
    response_model=MoodEntryResponse,
    summary="Create mood_entry",
    description="Create a new mood_entry",
)
async def create_mood_entry(
        auth_service: CommonAuthService,
        mood_entry: MoodEntryCreate,
        mood_entry_service: CommonMoodEntryService,
        token: str = Depends(oauth2_scheme_user)
):
    user: User = await auth_service.get_current_user(token)
    mood_entry = await mood_entry_service.create_mood_entry(mood_entry, user.id)
    return mood_entry


@router.patch(
    "/update",
    response_model=MoodEntryResponse,
    summary="Update mood_entry",
    description="Update an existing mood_entry",
)
async def update_mood_entry(
        mood_entry_id: int,
        mood_entry_update: MoodEntryUpdate,
        mood_entry_service: CommonMoodEntryService
):
    mood_entry = await mood_entry_service.update_mood_entry(mood_entry_id, mood_entry_update)
    return mood_entry


@router.delete(
    "/delete",
    response_model=dict,
    summary="Delete mood_entry",
    description="Delete an existing mood_entry",
)
async def delete_mood_entry(
        mood_entry_id: int,
        mood_entry_service: CommonMoodEntryService
):
    detail = await mood_entry_service.delete_mood_entry(mood_entry_id)
    return detail
