from pydantic import BaseModel


class MoodContextBase(BaseModel):
    context_factor_id: int
    effect_id: int


class MoodContextCreate(MoodContextBase):
    pass


class MoodContextUpdate(MoodContextBase):
    pass


class MoodContextResponse(MoodContextBase):
    id: int
    mood_entry_id: int

    class Config:
        from_attributes = True
