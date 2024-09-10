"""
Не сделано
"""
from sqlalchemy import asc
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from models.mood_entry import MoodEntry
from schemas.pagination import PaginatedResponse
from .base import BaseRepository
from schemas.mood_entry import MoodEntryCreate, MoodEntryUpdate, MoodEntryResponse

from datetime import date


class MoodEntryRepository(BaseRepository):
    
    async def get_mood_entry_by_id(
            self,
            mood_entry_id: int
    ) -> MoodEntry | None:
        async with self.connection as session:
            result = await session.execute(
                select(MoodEntry)
                .options(selectinload(MoodEntry.mood_emotions), selectinload(MoodEntry.mood_contexts))
                .filter(MoodEntry.id == mood_entry_id)
            )
            mood_entry = result.scalars().first()
        return mood_entry

    async def get_all_mood_entry_by_user_id_by_date(
            self,
            user_id: int,
            start_date: date | None = None,
            end_date: date | None = None,
            cursor: int | None = None,
            limit: int = 10
    ) -> PaginatedResponse:
        async with self.connection as session:
            query = select(MoodEntry).filter(MoodEntry.user_id == user_id).order_by(MoodEntry.id)

            if start_date:
                query = query.filter(MoodEntry.entry_date >= start_date)
            if end_date:
                query = query.filter(MoodEntry.entry_date <= end_date)

            if cursor:
                query = query.filter(MoodEntry.id > cursor)

            query = query.limit(limit)

            result = await session.execute(query)

            mood_entries = result.scalars().all()

            mood_entries_responses = [MoodEntryResponse.model_validate(item) for item in mood_entries]
            next_cursor = mood_entries[-1].id if len(mood_entries) >= limit else None
        return PaginatedResponse(
            items=mood_entries_responses[:limit],
            next_cursor=next_cursor + 1
        )

    async def create_mood_entry(
            self,
            mood_entry_create: MoodEntryCreate,
            user_id: int
    ) -> MoodEntry:

        async with self.connection as session:
            mood_entry = MoodEntry(
                user_id=user_id,
                general_well_being=mood_entry_create.general_well_being,
                energy_level=mood_entry_create.energy_level,
                stress_level=mood_entry_create.stress_level,
                sleep_quality=mood_entry_create.sleep_quality,
                entry_date=mood_entry_create.entry_date
            )
            session.add(mood_entry)
            await session.commit()
            await session.refresh(mood_entry)

        return mood_entry

    async def update_mood_entry(
            self,
            mood_entry: MoodEntry,
            mood_entry_update: MoodEntryUpdate
    ) -> MoodEntry:
        async with self.connection as session:
            update_fields = mood_entry_update.dict(exclude_unset=True)  # get rid of None
            for field, value in update_fields.items():
                if field not in ["mood_contexts", "mood_emotions"]:
                    setattr(mood_entry, field, value)

            session.add(mood_entry)

            await session.commit()
            await session.refresh(mood_entry)
        return mood_entry

    async def delete_mood_entry(
            self,
            mood_entry: MoodEntry
    ) -> dict:
        async with self.connection as session:
            await session.delete(mood_entry)
            await session.commit()
        return {"detail": "MoodEntry deleted"}
