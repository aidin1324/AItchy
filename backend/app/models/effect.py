from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class Effect(Base):
    __tablename__ = "effects"

    id = Column(Integer, primary_key=True)
    name = Column(String)

    mood_contexts = relationship("MoodContext", back_populates="effect", lazy="dynamic")

