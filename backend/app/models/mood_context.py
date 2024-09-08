from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from db.database import Base


class MoodContext(Base):
    __tablename__ = "mood_contexts"

    id = Column(Integer, primary_key=True)
    mood_entry_id = Column(Integer, ForeignKey("mood_entries.id"))
    context_factor_id = Column(Integer, ForeignKey("context_factors.id"))
    effect_id = Column(Integer, ForeignKey("effects.id"))

    mood_entry = relationship("MoodEntry", back_populates="mood_contexts")
    context_factor = relationship("ContextFactor", back_populates="mood_contexts")
    effect = relationship("Effect", back_populates="mood_contexts")

