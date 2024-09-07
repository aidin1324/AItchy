from sqlalchemy import Date, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


class MoodEntry(Base):
    __tablename__ = "mood_entries"

    id = Column(Integer, primary_key=True)
    general_well_being = Column(Integer)
    energy_level = Column(Integer)
    stress_level = Column(Integer)
    sleep_quality = Column(Integer)
    entry_date = Column(Date, default=func.now, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="mood_entries")
    mood_emotions = relationship("MoodEmotion", back_populates="mood_entry", lazy="dynamic")
    mood_contexts = relationship("MoodContext", back_populates="mood_entry", lazy="dynamic")