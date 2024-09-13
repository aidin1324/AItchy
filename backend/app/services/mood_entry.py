from datetime import date

from asyncpg import UniqueViolationError
from fastapi.exceptions import HTTPException

from repository.mood_entry import MoodEntryRepository
from services.mood_emotion import MoodEmotionService
from services.mood_context import MoodContextService

from models.mood_entry import MoodEntry

from schemas.mood_entry import MoodEntryCreate, MoodEntryUpdate, MoodEntryResponse
from schemas.pagination import PaginatedResponse
from sqlalchemy.exc import IntegrityError


class MoodEntryService:
    def __init__(
            self,
            mood_entry_repo: MoodEntryRepository,
            mood_emotion_serv: MoodEmotionService,
            mood_context_serv: MoodContextService
    ):
        self.mood_entry_repo = mood_entry_repo
        self.mood_emotion_serv = mood_emotion_serv
        self.mood_context_serv = mood_context_serv

    async def get_mood_entry_by_id(
            self,
            mood_entry_id: int
    ) -> MoodEntry:
        try:
            mood_entry = await self.mood_entry_repo.get_mood_entry_by_id(mood_entry_id)
            if mood_entry is None:
                raise HTTPException(status_code=404, detail="MoodEntry not found")
            return mood_entry
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def get_paginated_mood_entries_by_user_id_by_date(
            self,
            user_id: int,
            start_date: date | None = None,
            end_date: date | None = None,
            cursor: date | None = None,
            limit: int = 10
    ) -> PaginatedResponse[MoodEntryResponse]:
        if limit <= 0:
            raise HTTPException(status_code=400, detail="Limit must be greater than 0")
        try:
            mood_entries = await self.mood_entry_repo.get_all_mood_entry_by_user_id_by_date(
                user_id=user_id,
                start_date=start_date,
                end_date=end_date,
                cursor=cursor,
                limit=limit
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        return mood_entries

    async def create_mood_entry(
            self,
            mood_entry_create: MoodEntryCreate,
            user_id: int
    ) -> MoodEntry:
        try:
            mood_entry: MoodEntry = await self.mood_entry_repo.create_mood_entry(
                mood_entry_create,
                user_id=user_id
            )

            for mood_con in mood_entry_create.mood_contexts:
                await self.mood_context_serv.create_mood_context(
                    mood_con,
                    mood_entry_id=mood_entry.id
                )

            for mood_emo in mood_entry_create.mood_emotions:
                await self.mood_emotion_serv.create_mood_emotion(
                    mood_emo,
                    mood_entry_id=mood_entry.id
                )

            return mood_entry
        except IntegrityError as e:
            raise HTTPException(
                status_code=400,
                detail="duplicate key value"
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def update_mood_entry(
            self,
            mood_entry_id: int,
            mood_entry_update: MoodEntryUpdate
    ) -> MoodEntry:
        """
            ОШИБКА В  mood_entry.mood_contexts И mood_entry.mood_emotions
        """
        try:
            mood_entry = await self.mood_entry_repo.get_mood_entry_by_id(mood_entry_id)
            if mood_entry is None:
                raise HTTPException(status_code=404, detail="MoodEntry not found")
            mood_entry = await self.mood_entry_repo.update_mood_entry(mood_entry, mood_entry_update)

            for mood_context_update in mood_entry_update.mood_contexts:
                await self.mood_context_serv.update_mood_context(
                    mood_entry.mood_contexts,
                    mood_context_update
                )

            for mood_emotion_update in mood_entry_update.mood_emotions:
                await self.mood_emotion_serv.update_mood_emotion(
                    mood_entry.mood_emotions,
                    mood_emotion_update
                )

            return mood_entry
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def delete_mood_entry(
            self,
            mood_entry_id: int
    ) -> dict:
        try:
            mood_entry = await self.mood_entry_repo.get_mood_entry_by_id(mood_entry_id)
            if mood_entry is None:
                raise HTTPException(status_code=404, detail="MoodEntry not found")

            detail = await self.mood_entry_repo.delete_mood_entry(mood_entry)
            return detail
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
