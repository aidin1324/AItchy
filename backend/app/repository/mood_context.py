from sqlalchemy.future import select

from models.mood_context import MoodContext
from .base import BaseRepository
from schemas.mood_context import MoodContextCreate, MoodContextUpdate


class MoodContextRepository(BaseRepository):

    async def get_all_mood_contexts(
            self
    ) -> list[MoodContext]:
        async with self.connection as session:
            result = await session.execute(select(MoodContext))
            mood_contexts = result.scalars().all()
        return mood_contexts

    async def get_mood_context_by_id(
            self,
            mood_context_id: int
    ) -> MoodContext | None:
        async with self.connection as session:
            result = await session.execute(select(MoodContext).filter(MoodContext.id == mood_context_id))
            mood_context = result.scalars().first()
        return mood_context

    async def create_mood_context(
            self,
            mood_context_create: MoodContextCreate
    ) -> MoodContext:
        mood_context = MoodContext(**mood_context_create.model_dump())

        async with self.connection as session:
            session.add(mood_context)
            await session.commit()
            await session.refresh(mood_context)
        return mood_context

    async def update_mood_context(
            self,
            mood_context: MoodContext,
            mood_context_update: MoodContextUpdate
    ) -> MoodContext:
        async with self.connection as session:
            update_fields = mood_context_update.dict(exclude_unset=True)  # get rid of None
            for field, value in update_fields.items():
                setattr(mood_context, field, value)

            session.add(mood_context)

            await session.commit()
            await session.refresh(mood_context)
        return mood_context

    async def delete_mood_context(
            self,
            mood_context: MoodContext
    ) -> dict:
        async with self.connection as session:
            await session.delete(mood_context)
            await session.commit()
        return {"detail": "MoodContext deleted"}
