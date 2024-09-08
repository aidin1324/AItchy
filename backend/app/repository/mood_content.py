

from sqlalchemy import select
from models.mood_content import MoodContent
from schemas.mood_content import MoodContentCreate, MoodContentResponse, MoodContentUpdate
from repository.base import BaseRepository


class MoodContentRepository(BaseRepository):
    
    async def get_moods(self) -> list[MoodContentResponse]:
        async with self.connection as session:
            result = await session.execute(select(MoodContent))
            moods = result.scalars().all()
        return moods
    
    async def get_mood_by_id(self, mood_id: int) -> MoodContentResponse:
        async with self.connection as session:
            result = await session.execute(select(MoodContent).filter(MoodContent.id == mood_id))
            mood = result.scalars().first()
        return mood
    
    async def get_mood_by_type(self, mood_type: str) -> MoodContentResponse:
        async with self.connection as session:
            result = await session.execute(select(MoodContent).filter(MoodContent.type == mood_type))
            mood = result.scalars().first()
        return mood
    
    async def create_mood(self, mood: MoodContentCreate) -> MoodContentResponse:
        mood = mood.model_dump()
        mood = MoodContent(**mood)
        async with self.connection as session:
            session.add(mood)
            await session.commit()
            await session.refresh(mood)
        return mood
    
    async def update_mood(self, mood: MoodContentResponse, mood_update: MoodContentUpdate) -> MoodContentResponse:
        async with self.connection as session:
            update_fields = mood_update.model_dump(exclude_unset=True)
            for field, value in update_fields.items():
                setattr(mood, field, value)
                
            session.add(mood)
            
            await session.commit()
            await session.refresh(mood)
        return mood
    
    async def delete_mood(self, mood: MoodContentResponse) -> dict:
        async with self.connection as session:
            await session.delete(mood)
            await session.commit()
        return {"detail": "Mood deleted"}