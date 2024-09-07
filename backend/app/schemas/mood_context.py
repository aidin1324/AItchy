from pydantic import BaseModel


class MoodContextBase(BaseModel):
    pass


class MoodContextCreate(MoodContextBase):
    pass


class MoodContextUpdate(MoodContextBase):
    pass


class MoodContextResponse(MoodContextBase):
    id: int
    mood_entry_id: int
    context_factor: int
    effect_id: int

    class Config:
        from_attributes = True
