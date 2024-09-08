from pydantic import BaseModel


class MoodEmotionBase(BaseModel):
    intensity: int
    mood_entry_id: int
    emotion_id: int


class MoodEmotionCreate(MoodEmotionBase):
    pass


class MoodEmotionUpdate(MoodEmotionBase):
    intensity: int | None = None


class MoodEmotionResponse(MoodEmotionBase):
    id: int

    class Config:
        from_attributes = True
