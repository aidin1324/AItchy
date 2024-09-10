from sqlalchemy.future import select

from models.context_factor import ContextFactor
from .base import BaseRepository
from schemas.context_factor import ContextFactorCreate, ContextFactorUpdate


class ContextFactorRepository(BaseRepository):

    async def get_all_context_factors(
            self
    ) -> list[ContextFactor]:
        async with self.connection as session:
            result = await session.execute(select(ContextFactor))
            context_factors = result.scalars().all()
        return list(context_factors)

    async def get_context_factor_by_id(
            self,
            context_factor_id: int
    ) -> ContextFactor | None:
        async with self.connection as session:
            result = await session.execute(select(ContextFactor).filter(ContextFactor.id == context_factor_id))
            context_factor = result.scalars().first()
        return context_factor

    async def get_context_factor_by_name(
            self,
            name: str
    ) -> ContextFactor | None:
        async with self.connection as session:
            result = await session.execute(select(ContextFactor).filter(ContextFactor.name == name))
            context_factor = result.scalars().first()
        return context_factor

    async def create_context_factor(
            self,
            context_factor_create: ContextFactorCreate
    ) -> ContextFactor:
        context_factor = ContextFactor(**context_factor_create.model_dump())

        async with self.connection as session:
            session.add(context_factor)
            await session.commit()
            await session.refresh(context_factor)
        return context_factor

    async def update_context_factor(
            self,
            context_factor: ContextFactor,
            context_factor_update: ContextFactorUpdate
    ) -> ContextFactor:
        async with self.connection as session:
            update_fields = context_factor_update.dict(exclude_unset=True)  # get rid of None
            for field, value in update_fields.items():
                setattr(context_factor, field, value)

            session.add(context_factor)

            await session.commit()
            await session.refresh(context_factor)
        return context_factor

    async def delete_context_factor(
            self,
            context_factor: ContextFactor
    ) -> dict:
        async with self.connection as session:
            await session.delete(context_factor)
            await session.commit()
        return {"detail": "ContextFactor deleted"}
