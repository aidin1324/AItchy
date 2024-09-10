from fastapi.exceptions import HTTPException

from repository.mood_emotion import MoodEmotionRepository
from models.mood_emotion import MoodEmotion

from schemas.mood_emotion import MoodEmotionCreate, MoodEmotionUpdate


class MoodEmotionService:
    def __init__(self, mood_emotion_repo: MoodEmotionRepository):
        self.mood_emotion_repo = mood_emotion_repo

    async def get_all_mood_emotion(self):
        try:
            mood_emotions = await self.mood_emotion_repo.get_all_mood_emotions()
            return mood_emotions
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def get_mood_emotion_by_id(
            self,
            mood_emotion_id: int
    ) -> MoodEmotion:
        try:
            mood_emotion = await self.mood_emotion_repo.get_mood_emotion_by_id(mood_emotion_id)
            if mood_emotion is None:
                raise HTTPException(status_code=404, detail="MoodEmotion not found")
            return mood_emotion
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def create_mood_emotion(
            self,
            mood_emotion_create: MoodEmotionCreate,
            mood_entry_id: int
    ) -> MoodEmotion:
        try:
            mood_emotion = await self.mood_emotion_repo.create_mood_emotion(
                mood_emotion_create,
                mood_entry_id=mood_entry_id
            )
            return mood_emotion
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def update_mood_emotion(
            self,
            mood_emotion_id: int,
            mood_emotion_update: MoodEmotionUpdate
    ) -> MoodEmotion:
        try:
            mood_emotion = await self.mood_emotion_repo.get_mood_emotion_by_id(mood_emotion_id)
            if mood_emotion is None:
                raise HTTPException(status_code=404, detail="MoodEmotion not found")
            mood_emotion = await self.mood_emotion_repo.update_mood_emotion(mood_emotion, mood_emotion_update)
            return mood_emotion
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def delete_mood_emotion(
            self,
            mood_emotion_id: int
    ) -> dict:
        try:
            mood_emotion = await self.mood_emotion_repo.get_mood_emotion_by_id(mood_emotion_id)
            if mood_emotion is None:
                raise HTTPException(status_code=404, detail="MoodEmotion not found")

            detail = await self.mood_emotion_repo.delete_mood_emotion(mood_emotion)
            return detail
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
