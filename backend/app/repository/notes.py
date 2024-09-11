from datetime import date
from typing import Optional
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import Date, DateTime, select
from schemas.pagination import PaginatedResponse
from models.mood_content import MoodContent
from models.emotion import Emotion
from models.notes import Note
from repository.base import BaseRepository
from schemas.notes import NoteCreate, NoteResponse, NoteUpdate


class NotesRepository(BaseRepository):

    async def get_notes(
            self, last_id: Optional[int] = None, limit: int = 10
    ) -> PaginatedResponse[NoteResponse]:
        async with self.connection as session:
            query = select(Note).order_by(Note.id)

            if last_id:
                query = query.filter(Note.id > last_id)

            query = query.limit(limit + 1)

            result = await session.execute(query)
            notes = result.scalars().all()

            # Convert to NoteResponse
            note_responses = [NoteResponse.model_validate(note) for note in notes]

            # Determine the next cursor
            next_cursor = note_responses[-1].id if len(notes) > limit else None

            return PaginatedResponse(
                items=note_responses[:limit],  # Only return the limit number of notes
                next_cursor=next_cursor
            )

    async def get_note_by_id(self, note_id: int) -> Note:
        async with self.connection as session:
            result = await session.execute(select(Note).filter(Note.id == note_id))
            note = result.scalars().first()
        return note

    async def get_notes_by_date(
            self,
            start_date: Optional[date] = None,
            end_date: Optional[date] = None,
            last_id: Optional[int] = None,
            limit: int = 10,
    ) -> list[Note]:
        async with self.connection as session:
            query = select(Note).order_by(Note.id)

            # Фильтрация по дате начала
            if start_date is not None:
                query = query.filter(Note.note_date >= start_date)

            # Фильтрация по дате окончания
            if end_date is not None:
                query = query.filter(Note.note_date <= end_date)

            if last_id:
                query = query.filter(Note.id > last_id)

            query = query.limit(limit)

            result = await session.execute(query)
            notes = result.scalars().all()

            note_responses = [NoteResponse.model_validate(note) for note in notes]

            # Determine the next cursor
            next_cursor = notes[-1].id if len(notes) > limit else None

            return PaginatedResponse(
                items=note_responses[:limit],  # Only return the limit number of notes
                next_cursor=next_cursor
            )

    async def get_notes_by_mood(
            self, mood: str, last_id: Optional[int] = None, limit: int = 10
    ) -> list[Note]:
        async with self.connection as session:
            mood_result = await session.execute(
                select(MoodContent).filter(MoodContent.type == mood)
            )
            mood_id = mood_result.scalars().first().id

            query = select(Note).filter(Note.mood_id == mood_id).order_by(Note.id)

            if last_id:
                query = query.filter(Note.id > last_id)

            query = query.limit(limit)

            result = await session.execute(query)
            notes = result.scalars().all()

            note_responses = [NoteResponse.model_validate(note) for note in notes]

            # Determine the next cursor
            next_cursor = notes[-1].id if len(notes) > limit else None

            return PaginatedResponse(
                items=note_responses[:limit],  # Only return the limit number of notes
                next_cursor=next_cursor
            )

    async def create_note(self, note: NoteCreate, user_id: int) -> Note:

        note = note.model_dump()
        note = Note(**note, user_id=user_id)
        async with self.connection as session:
            session.add(note)
            await session.commit()
            await session.refresh(note)
        return note

    async def update_note(self, note: Note, note_update: NoteUpdate) -> Note:
        async with self.connection as session:
            note.mood_id = session.execute(
                select(MoodContent).filter(MoodContent.type == note.mood_id)).scalars().first().id

            update_fields = note_update.model_dump(exclude_unset=True)
            for field, value in update_fields.items():
                setattr(note, field, value)

            session.add(note)

            await session.commit()
            await session.refresh(note)
        return note

    async def delete_note(self, note: Note) -> dict:
        async with self.connection as session:
            await session.delete(note)
            await session.commit()
        return {"detail": "Note deleted"}
