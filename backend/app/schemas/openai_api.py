from pydantic import BaseModel


class ModelResponse(BaseModel):
    note_id: int
    response: str

    class Config:
        from_attributes = True
