from pydantic import BaseModel

from typing import List
from .mood_context import MoodContextResponse


class EffectBase(BaseModel):
    name: str


class EffectCreate(EffectBase):
    pass


class EffectUpdate(EffectBase):
    name: str | None


class EffectResponse(EffectBase):
    id: int
    mood_contexts: List[MoodContextResponse] = []

    class Config:
        from_attributes = True
