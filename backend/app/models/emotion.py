from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class Emotion(Base):
    __tablename__ = "emotions"

    id = Column(Integer, primary_key=True)
    name = Column(String)

    mood_emotions = relationship("Mood_emotion", back_populates="emotion", lazy="dynamic")

