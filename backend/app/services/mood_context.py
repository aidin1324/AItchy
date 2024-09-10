from fastapi.exceptions import HTTPException

from repository.mood_context import MoodContextRepository
from models.mood_context import MoodContext

from schemas.mood_context import MoodContextCreate, MoodContextUpdate


class MoodContextService:
    def __init__(self, mood_context_repo: MoodContextRepository):
        self.mood_context_repo = mood_context_repo

    async def get_all_mood_context(self):
        try:
            mood_contexts = await self.mood_context_repo.get_all_mood_contexts()
            return mood_contexts
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def get_mood_context_by_id(
            self,
            mood_context_id: int
    ) -> MoodContext:
        try:
            mood_context = await self.mood_context_repo.get_mood_context_by_id(mood_context_id)
            if mood_context is None:
                raise HTTPException(status_code=404, detail="MoodContext not found")
            return mood_context
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def create_mood_context(
            self,
            mood_context_create: MoodContextCreate,
            mood_entry_id: int
    ) -> MoodContext:
        try:
            mood_context = await self.mood_context_repo.create_mood_context(
                mood_context_create,
                mood_entry_id=mood_entry_id
            )
            return mood_context
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def update_mood_context(
            self,
            mood_context_id: int,
            mood_context_update: MoodContextUpdate
    ) -> MoodContext:
        try:
            mood_context = await self.mood_context_repo.get_mood_context_by_id(mood_context_id)
            if mood_context is None:
                raise HTTPException(status_code=404, detail="MoodContext not found")
            mood_context = await self.mood_context_repo.update_mood_context(mood_context, mood_context_update)
            return mood_context
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def delete_mood_context(
            self,
            mood_context_id: int
    ) -> dict:
        try:
            mood_context = await self.mood_context_repo.get_mood_context_by_id(mood_context_id)
            if mood_context is None:
                raise HTTPException(status_code=404, detail="MoodContext not found")

            detail = await self.mood_context_repo.delete_mood_context(mood_context)
            return detail
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
