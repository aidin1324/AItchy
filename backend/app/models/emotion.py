from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from db.database import Base


class Emotion(Base):
    __tablename__ = "emotions"

    id = Column(Integer, primary_key=True)
    name = Column(String)

    mood_emotions = relationship("MoodEmotion", back_populates="emotion", lazy="dynamic")

