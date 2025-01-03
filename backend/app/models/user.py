from sqlalchemy import Boolean, Column, Date, Integer, String
from sqlalchemy.orm import relationship

from db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    surname = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    gender = Column(String)
    birth_date = Column(Date)
    is_superuser = Column(Boolean, default=False)
    is_premium = Column(Boolean, default=False)

    notes = relationship("Note", back_populates="owner", lazy="dynamic")
    mood_entries = relationship("MoodEntry", back_populates="owner", lazy="dynamic")