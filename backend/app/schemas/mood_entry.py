from pydantic import BaseModel, Field
from typing import List

from datetime import date
from .mood_context import MoodContextResponse
from .mood_emotion import MoodEmotionResponse


class MoodEntryBase(BaseModel):
    general_well_being: int
    energy_level: int
    stress_level: int
    sleep_quality: int
    entry_date: date = Field(default_factory=date.today)


class MoodEntryCreate(MoodEntryBase):
    pass


class MoodEntryUpdate(MoodEntryBase):
    general_well_being: int | None = None
    energy_level: int | None = None
    stress_level: int | None = None
    sleep_quality: int | None = None


class MoodEntryResponse(MoodEntryBase):
    id: int
    user_id: int

    mood_emotions: List[MoodEmotionResponse] = []
    mood_contexts: List[MoodContextResponse] = []

    class Config:
        from_attributes = True
