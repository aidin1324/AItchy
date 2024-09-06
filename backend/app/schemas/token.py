from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: int
    is_superuser: bool
    is_premium: bool

    class Config:
        from_attributes = True
