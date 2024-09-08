from fastapi.exceptions import HTTPException

from repository.emotion import EmotionRepository
from models.emotion import Emotion

from schemas.emotion import EmotionCreate, EmotionUpdate


class EmotionService:
    def __init__(self, emotion_repo: EmotionRepository):
        self.emotion_repo = emotion_repo

    async def get_all_emotion(self):
        try:
            emotions = await self.emotion_repo.get_all_emotions()
            return emotions
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def get_emotion_by_id(
            self,
            emotion_id: int
    ) -> Emotion:
        try:
            emotion = await self.emotion_repo.get_emotion_by_id(emotion_id)
            if emotion is None:
                raise HTTPException(status_code=404, detail="Emotion not found")
            return emotion
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def get_emotion_by_name(
            self,
            name: str
    ) -> Emotion:
        try:
            emotion = await self.emotion_repo.get_emotion_by_name(name)
            if emotion is None:
                raise HTTPException(status_code=404, detail="Emotion not found")
            return emotion
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def create_emotion(
            self,
            emotion_create: EmotionCreate
    ) -> Emotion:
        try:
            emotion = await self.emotion_repo.get_emotion_by_name(emotion_create.name)
            if emotion is not None:
                raise HTTPException(status_code=409, detail="emotion already exists")
            emotion = await self.emotion_repo.create_emotion(emotion_create)
            return emotion
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def update_emotion(
            self,
            emotion_id: int,
            emotion_update: EmotionUpdate
    ) -> Emotion:
        try:
            emotion = await self.emotion_repo.get_emotion_by_id(emotion_id)
            if emotion is None:
                raise HTTPException(status_code=404, detail="Emotion not found")
            emotion = await self.emotion_repo.update_emotion(emotion, emotion_update)
            return emotion
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def delete_emotion(
            self,
            emotion_id: int
    ) -> dict:
        try:
            emotion = await self.emotion_repo.get_emotion_by_id(emotion_id)
            if emotion is None:
                raise HTTPException(status_code=404, detail="Emotion not found")

            detail = await self.emotion_repo.delete_emotion(emotion)
            return detail
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
