from datetime import date
from typing import Optional
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import Date, DateTime, select
from models.mood_content import MoodContent
from models.emotion import Emotion
from models.notes import Note
from repository.base import BaseRepository
from schemas.notes import NoteCreate, NoteUpdate




class NotesRepository(BaseRepository):

    async def get_notes(self) -> list[Note]:
        async with self.connection as session:
            result = await session.execute(select(Note))
            notes = result.scalars().all()
        return notes

    async def get_note_by_id(self, note_id: int) -> Note:
        async with self.connection as session:
            result = await session.execute(select(Note).filter(Note.id == note_id))
            note = result.scalars().first()
        return note

    async def get_notes_by_date(
        self, start_date: Optional[date] = None, end_date: Optional[date] = None
    ) -> list[Note]:
        async with self.connection as session:
            query = select(Note)
            
            # Фильтрация по дате начала
            if start_date is not None:
                query = query.filter(Note.note_date >= start_date)
            
            # Фильтрация по дате окончания
            if end_date is not None:
                query = query.filter(Note.note_date <= end_date)

            result = await session.execute(query)
            notes = result.scalars().all()

        return notes

    async def get_notes_by_mood(self, mood: str) -> list[Note]:
        async with self.connection as session:
            mood_result = await session.execute(
                select(MoodContent).filter(MoodContent.type == mood)
            )
            mood_id = mood_result.scalars().first().id
            result = await session.execute(select(Note).filter(Note.mood_id == mood_id))
            notes = result.scalars().all()
        return notes

    async def create_note(
        self, note: NoteCreate, user_id: int
    ) -> Note:
        
        note = note.model_dump()
        note = Note(**note, user_id=user_id)
        async with self.connection as session:
            session.add(note)
            await session.commit()
            await session.refresh(note)
        return note

    async def update_note(self, note: Note, note_update: NoteUpdate) -> Note:
        async with self.connection as session:
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
