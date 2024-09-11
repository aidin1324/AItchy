from datetime import date
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import Date

from api.dependencies import get_auth_service, get_notes_service
from schemas.pagination import PaginatedResponse
from services.authentication import AuthenticationService
from schemas.notes import NoteResponse, NoteCreate, NoteUpdate
from services.notes import NotesService


router = APIRouter()

oauth2_scheme_user = OAuth2PasswordBearer(
    tokenUrl="auth/login/user", scheme_name="user"
)

CommonNotesService = Annotated[NotesService, Depends(get_notes_service)]
CommonAuthService = Annotated[AuthenticationService, Depends(get_auth_service)]
CommonToken = Annotated[str, Depends(oauth2_scheme_user)]


@router.get(
    "/all",
    response_model=PaginatedResponse[NoteResponse],
    summary="Get all notes",
    description="Retrieve information about all existing notes with pagination",
)
async def get_all_notes(
    auth_service: CommonAuthService,
    token: CommonToken,
    notes_service: CommonNotesService,
    last_id: Optional[int] = Query(None, description="Cursor for pagination"),
    limit: int = Query(10, description="Number of notes to retrieve per page"),
):
    user = await auth_service.get_current_user(token)
    user_id = user.id
    paginated_notes = await notes_service.get_notes(
        user_id=user_id, last_id=last_id, limit=limit
    )
    return paginated_notes


@router.get(
    "/by-id",
    response_model=NoteResponse,
    summary="Get note by id",
    description="Retrieve information about a specific note",
)
async def get_note_by_id(
    auth_service: CommonAuthService,
    token: CommonToken,
    note_id: int,
    notes_service: CommonNotesService,
):
    user = await auth_service.get_current_user(token)
    user_id = user.id
    note = await notes_service.get_note_by_id(user_id=user_id, note_id=note_id)
    return note


@router.get(
    "/by-date",
    response_model=PaginatedResponse[NoteResponse],
    summary="Get notes by date",
    description="Retrieve information about notes by date with pagination",
)
async def get_notes_by_date(
    auth_service: CommonAuthService,
    token: CommonToken,
    notes_service: CommonNotesService,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    last_id: Optional[int] = Query(None, description="Cursor for pagination"),
    limit: int = Query(10, description="Number of notes to retrieve per page"),
):
    user = await auth_service.get_current_user(token)
    user_id = user.id
    paginated_notes = await notes_service.get_notes_by_date(
        user_id=user_id,
        start_date=start_date,
        end_date=end_date,
        last_id=last_id,
        limit=limit,
    )
    return paginated_notes


@router.get(
    "/by-emotion",
    response_model=PaginatedResponse[NoteResponse],
    summary="Get notes by emotion",
    description="Retrieve information about notes by emotion with pagination",
)
async def get_notes_by_mood(
    auth_service: CommonAuthService,
    token: CommonToken,
    mood: str,
    notes_service: CommonNotesService,
    last_id: Optional[int] = Query(None, description="Cursor for pagination"),
    limit: int = Query(10, description="Number of notes to retrieve per page"),
):
    user = await auth_service.get_current_user(token)
    user_id = user.id
    paginated_notes = await notes_service.get_notes_by_mood(
        user_id=user_id, mood=mood, last_id=last_id, limit=limit
    )
    return paginated_notes


@router.post(
    "/create",
    response_model=NoteResponse,
    summary="Create note",
    description="Create a new note",
)
async def create_note(
    note: NoteCreate,
    notes_service: CommonNotesService,
    auth_service: CommonAuthService,
    token: CommonToken,
):
    try:
        user = await auth_service.get_current_user(token)
        user_id = user.id
        new_note = await notes_service.create_note(note, user_id)
        return new_note
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")


@router.patch(
    "/update",
    response_model=dict,
    summary="Update note",
    description="Update an existing note by id",
)
async def update_note(
    note_id: int, note_update: NoteUpdate, notes_service: CommonNotesService
):
    message = await notes_service.update_note(note_id, note_update)
    return message


@router.delete(
    "/delete",
    response_model=dict,
    summary="Delete note",
    description="Delete an existing note by id",
)
async def delete_note(note_id: int, notes_service: CommonNotesService):
    delete_message = await notes_service.delete_note(note_id)
    return delete_message
