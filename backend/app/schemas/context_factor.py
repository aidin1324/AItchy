from pydantic import BaseModel

from typing import List
from .mood_context import MoodContextResponse


class ContextFactorBase(BaseModel):
    name: str


class ContextFactorCreate(ContextFactorBase):
    pass


class ContextFactorUpdate(ContextFactorBase):
    name: str | None


class ContextFactorResponse(ContextFactorBase):
    id: int
    mood_contexts: List[MoodContextResponse] = []

    class Config:
        from_attributes = True
