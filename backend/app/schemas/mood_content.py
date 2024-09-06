from pydantic import BaseModel

from typing import List
from .notes import NoteResponse


class MoodContentBase(BaseModel):
    type: str


class MoodContentCreate(MoodContentBase):
    pass


class MoodContentUpdate(MoodContentBase):
    type: str | None


class MoodContentResponse(MoodContentBase):
    id: int
    notes: List[NoteResponse] = []

    class Config:
        from_attributes = True
