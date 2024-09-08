from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from db.database import Base


class MoodEmotion(Base):
    __tablename__ = "mood_emotions"

    id = Column(Integer, primary_key=True)
    intensity = Column(Integer)
    mood_entry_id = Column(Integer, ForeignKey("mood_entries.id"))
    emotion_id = Column(Integer, ForeignKey("emotions.id"))

    mood_entry = relationship("MoodEntry", back_populates="mood_emotions")
    emotion = relationship("Emotion", back_populates="mood_emotions")

