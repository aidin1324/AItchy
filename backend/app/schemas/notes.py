from pydantic import BaseModel

from datetime import date


class NoteBase(BaseModel):
    content: str
    note_date: date = date.today()


class NoteCreate(NoteBase):
    pass


class NoteUpdate(NoteBase):
    content: str | None = None


class NoteResponse(NoteBase):
    id: int

    user_id: int
    mood_id: int

    class Config:
        from_attributes = True
