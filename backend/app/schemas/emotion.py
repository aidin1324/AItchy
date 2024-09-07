from pydantic import BaseModel

from typing import List
from .mood_emotion import MoodEmotionResponse


class EmotionBase(BaseModel):
    name: str


class EmotionCreate(EmotionBase):
    pass


class EmotionUpdate(EmotionBase):
    name: str | None = None


class EmotionResponse(EmotionBase):
    id: int
    mood_emotions: List[MoodEmotionResponse] = []

    class Config:
        from_attributes = True
