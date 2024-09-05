from sqlalchemy import Date, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True)
    content = Column(String)
    date = Column(Date, default=func.now, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    mood_id = Column(Integer, ForeignKey("mood_contents.id"))

    owner = relationship("User", back_populates="notes")
    mood_content = relationship("MoodContent", back_populates="notes")
