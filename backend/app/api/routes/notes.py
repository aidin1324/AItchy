from datetime import date
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import Date

from api.dependencies import get_auth_service, get_notes_service
from services.authentication import AuthenticationService
from schemas.notes import NoteResponse, NoteCreate, NoteUpdate
from services.notes import NotesService
from jose import JWTError, jwt
from config import secret_key, algorithm


router = APIRouter()

oauth2_scheme_user = OAuth2PasswordBearer(
    tokenUrl="auth/login/user", scheme_name="user"
)
CommonNotesService = Annotated[NotesService, Depends(get_notes_service)]




@router.get(
    "/all",
    response_model=list[NoteResponse],
    summary="Get all notes",
    description="Retrieve information about all existing notes",
)
async def get_all_notes(notes_service: CommonNotesService):
    notes = await notes_service.get_notes()
    return notes


@router.get(
    "/by-id",
    response_model=NoteResponse,
    summary="Get note by id",
    description="Retrieve information about a specific note",
)
async def get_note_by_id(note_id: int, notes_service: CommonNotesService):
    note = await notes_service.get_note_by_id(note_id)
    return note


@router.get(
    "/by-date",
    response_model=list[NoteResponse],
    summary="Get notes by date",
    description="Retrieve information about notes by date",
)
async def get_notes_by_date(
    notes_service: CommonNotesService,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
):
    notes = await notes_service.get_notes_by_date(start_date, end_date)
    return notes


@router.get(
    "/by-emotion",
    response_model=list[NoteResponse],
    summary="Get notes by emotion",
    description="Retrieve information about notes by emotion",
)
async def get_notes_by_mood(mood: str, notes_service: CommonNotesService):
    notes = await notes_service.get_notes_by_mood(mood)
    return notes


@router.post(
    "/create",
    response_model=NoteResponse,
    summary="Create note",
    description="Create a new note",
)
async def create_note(
    note: NoteCreate,
    notes_service: CommonNotesService,
    auth_service: Annotated[AuthenticationService, Depends(get_auth_service)],
    token: str = Depends(oauth2_scheme_user),
):
    try:
        print(token)
        user = await auth_service.get_current_user(token)
        user_id = user.id
        new_note = await notes_service.create_note(note, user_id)
        return new_note
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")


@router.patch(
    "/update",
    response_model=NoteResponse,
    summary="Update note",
    description="Update an existing note by id",
)
async def update_note(
    note_id: int, note_update: NoteUpdate, notes_service: CommonNotesService
):
    updated_note = await notes_service.update_note(note_id, note_update)
    return updated_note


@router.delete(
    "/delete",
    response_model=dict,
    summary="Delete note",
    description="Delete an existing note by id",
)
async def delete_note(note_id: int, notes_service: CommonNotesService):
    delete_message = await notes_service.delete_note(note_id)
    return delete_message