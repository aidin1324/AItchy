from pydantic import BaseModel, EmailStr, field_validator
import re
from typing import List

from .mood_entry import MoodEntryResponse
from .notes import NoteResponse


class UserBase(BaseModel):
    name: str
    surname: str
    email: EmailStr
    gender: str
    age: int
    is_superuser: bool
    is_premium: bool


class UserCreate(UserBase):
    password: str

    @field_validator("password")
    def validate_password(cls, value: str) -> str:
        # Проверка длины пароля
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long")

        if not re.search(r"\d", value):
            raise ValueError("Password must contain at least one digit")

        if not re.search(r"[A-Z]", value):
            raise ValueError("Password must contain at least one uppercase letter")

        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise ValueError("Password must contain at least one special character")
        return value


class UserUpdate(UserBase):
    name: str | None = None
    surname: str | None = None
    gender: str | None = None
    age: int | None = None
    is_premium: bool | None = None


class UserResponse(UserBase):
    id: int

    notes: List[NoteResponse] = []
    mood_entries: List[MoodEntryResponse] = []

    class Config:
        from_attributes = True
