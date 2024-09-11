from typing import Optional
from pydantic import BaseModel

from datetime import date

from sqlalchemy import Date


class NoteBase(BaseModel):
    content: str
    note_date: date
    mood_id: int 


class NoteCreate(NoteBase):
    pass


class NoteUpdate(NoteBase):
    content: str | None = None
    note_date: date | None = None
    mood_id: int | None = None


class NoteResponse(NoteBase):
    id: int

    user_id: int

    class Config:
        from_attributes = True
