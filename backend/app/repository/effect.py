from sqlalchemy.future import select

from models.effect import Effect
from .base import BaseRepository
from schemas.effect import EffectCreate, EffectUpdate


class EffectRepository(BaseRepository):

    async def get_all_effects(
            self
    ) -> list[Effect]:
        async with self.connection as session:
            result = await session.execute(select(Effect))
            effects = result.scalars().all()
        return effects

    async def get_effect_by_id(
            self,
            effect_id: int
    ) -> Effect| None:
        async with self.connection as session:
            result = await session.execute(select(Effect).filter(Effect.id == effect_id))
            effect = result.scalars().first()
        return effect

    async def get_effect_by_name(
            self,
            name: str
    ) -> Effect| None:
        async with self.connection as session:
            result = await session.execute(select(Effect).filter(Effect.name == name))
            effect = result.scalars().first()
        return effect

    async def create_effect(
            self,
            effect_create: EffectCreate
    ) -> Effect:
        effect = Effect(**effect_create.model_dump())

        async with self.connection as session:
            session.add(effect)
            await session.commit()
            await session.refresh(effect)
        return effect

    async def update_effect(
            self,
            effect: Effect,
            effect_update: EffectUpdate
    ) -> Effect:
        async with self.connection as session:
            update_fields = effect_update.dict(exclude_unset=True)  # get rid of None
            for field, value in update_fields.items():
                setattr(effect, field, value)

            session.add(effect)

            await session.commit()
            await session.refresh(effect)
        return effect

    async def delete_effect(
            self,
            effect: Effect
    ) -> dict:
        async with self.connection as session:
            await session.delete(effect)
            await session.commit()
        return {"detail": "Effectdeleted"}
