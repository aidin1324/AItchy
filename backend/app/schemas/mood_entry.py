from pydantic import BaseModel, Field
from typing import List

from datetime import date
from .mood_context import MoodContextCreate, MoodContextUpdate, MoodContextResponse
from .mood_emotion import MoodEmotionCreate, MoodEmotionUpdate, MoodEmotionResponse


class MoodEntryBase(BaseModel):
    general_well_being: int
    energy_level: int
    stress_level: int
    sleep_quality: int
    entry_date: date = Field(default_factory=date.today)

    mood_emotions: List[MoodEmotionCreate] = []
    mood_contexts: List[MoodContextCreate] = []


class MoodEntryCreate(MoodEntryBase):
    pass


class MoodEntryUpdate(MoodEntryBase):
    general_well_being: int | None = None
    energy_level: int | None = None
    stress_level: int | None = None
    sleep_quality: int | None = None

    mood_emotions: List[MoodEmotionUpdate] = []
    mood_contexts: List[MoodContextUpdate] = []


class MoodEntryResponse(MoodEntryBase):
    id: int
    user_id: int

    mood_emotions: List[MoodEmotionResponse] = []
    mood_contexts: List[MoodContextResponse] = []

    class Config:
        from_attributes = True
