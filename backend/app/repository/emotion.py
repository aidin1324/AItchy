from sqlalchemy.future import select

from models.emotion import Emotion
from .base import BaseRepository
from schemas.emotion import EmotionCreate, EmotionUpdate


class EmotionRepository(BaseRepository):

    async def get_all_emotions(
            self
    ) -> list[Emotion]:
        async with self.connection as session:
            result = await session.execute(select(Emotion))
            emotions = result.scalars().all()
        return emotions

    async def get_emotion_by_id(
            self,
            emotion_id: int
    ) -> Emotion | None:
        async with self.connection as session:
            result = await session.execute(select(Emotion).filter(Emotion.id == emotion_id))
            emotion = result.scalars().first()
        return emotion

    async def get_emotion_by_name(
            self,
            name: str
    ) -> Emotion | None:
        async with self.connection as session:
            result = await session.execute(select(Emotion).filter(Emotion.name == name))
            emotion = result.scalars().first()
        return emotion

    async def create_emotion(
            self,
            emotion_create: EmotionCreate
    ) -> Emotion:
        emotion = Emotion(**emotion_create.model_dump())

        async with self.connection as session:
            session.add(emotion)
            await session.commit()
            await session.refresh(emotion)
        return emotion

    async def update_emotion(
            self,
            emotion: Emotion,
            emotion_update: EmotionUpdate
    ) -> Emotion:
        async with self.connection as session:
            update_fields = emotion_update.dict(exclude_unset=True)  # get rid of None
            for field, value in update_fields.items():
                setattr(emotion, field, value)

            session.add(emotion)

            await session.commit()
            await session.refresh(emotion)
        return emotion

    async def delete_emotion(
            self,
            emotion: Emotion
    ) -> dict:
        async with self.connection as session:
            await session.delete(emotion)
            await session.commit()
        return {"detail": "Emotion deleted"}
