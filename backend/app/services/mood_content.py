from fastapi import HTTPException
from models.mood_content import MoodContent
from repository.mood_content import MoodContentRepository
from schemas.mood_content import MoodContentCreate, MoodContentResponse, MoodContentUpdate


class MoodContentService:
    def __init__(self, mood_content_repo: MoodContentRepository):
        self.mood_content_repo = mood_content_repo
        
    async def get_moods(self) -> list[MoodContentResponse]:
        moods = await self.mood_content_repo.get_moods()
        return moods
    
    async def get_mood_by_id(self, mood_id: int) -> MoodContentResponse:
        mood = await self.mood_content_repo.get_mood_by_id(mood_id)
        if mood is None:
            raise HTTPException(status_code=404, detail="Mood not found")
        return mood
    
    async def get_mood_by_type(self, mood_type: str) -> MoodContentResponse:
        mood = await self.mood_content_repo.get_mood_by_type(mood_type)
        if mood is None:
            raise HTTPException(status_code=404, detail="Mood not found")
        return mood
    
    async def create_mood(self, mood: MoodContentCreate) -> MoodContentResponse:
        try:
            mood = await self.mood_content_repo.create_mood(mood)
            return mood
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        
    async def update_mood(self, mood_id: int, mood_update: MoodContentUpdate) -> MoodContentResponse:
        mood = await self.mood_content_repo.get_mood_by_id(mood_id)
        if mood is None:
            raise HTTPException(status_code=404, detail="Mood not found")
        
        try:
            mood = await self.mood_content_repo.update_mood(mood, mood_update)
            return mood
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        
    async def delete_mood(self, mood_id: int) -> dict:
        mood = await self.mood_content_repo.get_mood_by_id(mood_id)
        if mood is None:
            raise HTTPException(status_code=404, detail="Mood not found")
        
        try:
            detail = await self.mood_content_repo.delete_mood(mood)
            return detail
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))