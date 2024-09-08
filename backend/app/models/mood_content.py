from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from db.database import Base


class MoodContent(Base):
    __tablename__ = "mood_contents"

    id = Column(Integer, primary_key=True)
    type = Column(String)

    notes = relationship("Note", back_populates="mood_content", lazy="dynamic")

