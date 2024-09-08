from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from db.database import Base


class ContextFactor(Base):
    __tablename__ = "context_factors"

    id = Column(Integer, primary_key=True)
    name = Column(String)

    mood_contexts = relationship("MoodContext", back_populates="context_factor", lazy="dynamic")

