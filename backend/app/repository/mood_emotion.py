from sqlalchemy.future import select

from models.mood_emotion import MoodEmotion
from .base import BaseRepository
from schemas.mood_emotion import MoodEmotionCreate, MoodEmotionUpdate


class MoodEmotionRepository(BaseRepository):

    async def get_all_mood_emotions(
            self
    ) -> list[MoodEmotion]:
        async with self.connection as session:
            result = await session.execute(select(MoodEmotion))
            mood_emotions = result.scalars().all()
        return mood_emotions

    async def get_mood_emotion_by_id(
            self,
            mood_emotion_id: int
    ) -> MoodEmotion | None:
        async with self.connection as session:
            result = await session.execute(select(MoodEmotion).filter(MoodEmotion.id == mood_emotion_id))
            mood_emotion = result.scalars().first()
        return mood_emotion

    async def create_mood_emotion(
            self,
            mood_emotion_create: MoodEmotionCreate
    ) -> MoodEmotion:
        mood_emotion = MoodEmotion(**mood_emotion_create.model_dump())

        async with self.connection as session:
            session.add(mood_emotion)
            await session.commit()
            await session.refresh(mood_emotion)
        return mood_emotion

    async def update_mood_emotion(
            self,
            mood_emotion: MoodEmotion,
            mood_emotion_update: MoodEmotionUpdate
    ) -> MoodEmotion:
        async with self.connection as session:
            update_fields = mood_emotion_update.dict(exclude_unset=True)  # get rid of None
            for field, value in update_fields.items():
                setattr(mood_emotion, field, value)

            session.add(mood_emotion)

            await session.commit()
            await session.refresh(mood_emotion)
        return mood_emotion

    async def delete_mood_emotion(
            self,
            mood_emotion: MoodEmotion
    ) -> dict:
        async with self.connection as session:
            await session.delete(mood_emotion)
            await session.commit()
        return {"detail": "MoodEmotion deleted"}
