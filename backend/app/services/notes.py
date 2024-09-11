from datetime import date
from typing import Optional
from fastapi import HTTPException
from schemas.pagination import PaginatedResponse
from repository.notes import NotesRepository
from schemas.notes import NoteCreate, NoteResponse, NoteUpdate


class NotesService:
    def __init__(self, notes_repo: NotesRepository):
        self.notes_repo = notes_repo

    async def get_notes(
        self, user_id: int, last_id: Optional[int] = None, limit: int = 10
    ) -> PaginatedResponse[NoteResponse]:
        try:
            paginated_notes = await self.notes_repo.get_notes(
                user_id=user_id, last_id=last_id, limit=limit
            )
            return paginated_notes
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def get_note_by_id(self, note_id: int) -> NoteResponse:
        try:
            note = await self.notes_repo.get_note_by_id(note_id=note_id
            )
            if note is None:
                raise HTTPException(status_code=404, detail="Note not found")
            return note
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def get_notes_by_date(
        self,
        user_id: int,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        last_id: Optional[int] = None,
        limit: int = 10,
    ) -> PaginatedResponse[NoteResponse]:
        try:
            if start_date and end_date and start_date > end_date:
                raise HTTPException(status_code=400, detail="Invalid date range")

            paginated_notes = await self.notes_repo.get_notes_by_date(
                user_id=user_id,
                start_date=start_date,
                end_date=end_date,
                last_id=last_id,
                limit=limit,
            )
            return paginated_notes
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def get_notes_by_mood(
        self, user_id: int, mood: str, last_id: Optional[int] = None, limit: int = 10
    ) -> PaginatedResponse[NoteResponse]:
        try:
            if not mood:
                raise HTTPException(status_code=400, detail="Invalid mood")

            paginated_notes = await self.notes_repo.get_notes_by_mood(
                user_id=user_id, mood=mood, last_id=last_id, limit=limit
            )
            return paginated_notes
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def create_note(self, note: NoteCreate, user_id: int) -> NoteResponse:
        try:
            note = await self.notes_repo.create_note(note, user_id)
            return note
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error occurred: {str(e)}")

    async def update_note(self, note_id: int, note_update: NoteUpdate) -> dict:
        try:
            note = await self.notes_repo.get_note_by_id(note_id=note_id)
            if note is None:
                raise HTTPException(status_code=404, detail="Note not found")

            message = await self.notes_repo.update_note(note, note_update)
            return message
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def delete_note(self, note_id: int) -> dict:
        try:
            note = await self.notes_repo.get_note_by_id(note_id)

            if note is None:
                raise HTTPException(status_code=404, detail="Note not found")

            delete_message = await self.notes_repo.delete_note(note)
            return delete_message
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
