from datetime import date
from typing import Optional
from fastapi import HTTPException
from repository.notes import NotesRepository
from schemas.notes import NoteCreate, NoteResponse, NoteUpdate


class NotesService:
    def __init__(self, notes_repo: NotesRepository):
        self.notes_repo = notes_repo

    async def get_notes(self) -> list[NoteResponse]:
        try:
            notes = await self.notes_repo.get_notes()
            return notes
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def get_note_by_id(self, note_id: int) -> NoteResponse:
        try:
            note = await self.notes_repo.get_note_by_id(note_id)
            if note is None:
                raise HTTPException(status_code=404, detail="Note not found")

            return note
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def get_notes_by_date(
        self, start_date: Optional[date] = None, end_date: Optional[date] = None
    ) -> list[NoteResponse]:
        try:
            if start_date and end_date and start_date > end_date:
                raise HTTPException(status_code=400, detail="Invalid date range")

            notes = await self.notes_repo.get_notes_by_date(start_date, end_date)
            return notes
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def get_notes_by_mood(self, mood: str) -> list[NoteResponse]:
        try:
            if not mood:
                raise HTTPException(status_code=400, detail="Invalid mood")

            notes = await self.notes_repo.get_notes_by_mood(mood)
            return notes
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def create_note(self, note: NoteCreate, user_id: int) -> NoteResponse:
        try:
            note = await self.notes_repo.create_note(note, user_id)
            return note
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error occurred: {str(e)}")

    async def update_note(self, note_id: int, note_update: NoteUpdate) -> NoteResponse:
        try:
            note = await self.notes_repo.get_note_by_id(note_id)
            if note is None:
                raise HTTPException(status_code=404, detail="Note not found")

            note = await self.notes_repo.update_note(note, note_update)
            return note
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
