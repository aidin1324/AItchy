from fastapi.exceptions import HTTPException

from repository.context_factor import ContextFactorRepository
from models.context_factor import ContextFactor

from schemas.context_factor import ContextFactorCreate, ContextFactorUpdate


class ContextFactorService:
    def __init__(self, context_factor_repo: ContextFactorRepository):
        self.context_factor_repo = context_factor_repo

    async def get_all_context_factor(self):
        try:
            context_factors = await self.context_factor_repo.get_all_context_factors()
            return context_factors
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def get_context_factor_by_id(
            self,
            context_factor_id: int
    ) -> ContextFactor:
        try:
            context_factor = await self.context_factor_repo.get_context_factor_by_id(context_factor_id)
            if context_factor is None:
                raise HTTPException(status_code=404, detail="ContextFactor not found")
            return context_factor
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def get_context_factor_by_name(
            self,
            name: str
    ) -> ContextFactor:
        try:
            context_factor = await self.context_factor_repo.get_context_factor_by_name(name)
            if context_factor is None:
                raise HTTPException(status_code=404, detail="ContextFactor not found")
            return context_factor
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def create_context_factor(
            self,
            context_factor_create: ContextFactorCreate
    ) -> ContextFactor:
        try:
            context_factor = await self.context_factor_repo.get_context_factor_by_name(context_factor_create.name)
            if context_factor is not None:
                raise HTTPException(status_code=409, detail="context_factor already exists")
            context_factor = await self.context_factor_repo.create_context_factor(context_factor_create)
            return context_factor
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def update_context_factor(
            self,
            context_factor_id: int,
            context_factor_update: ContextFactorUpdate
    ) -> ContextFactor:
        try:
            context_factor = await self.context_factor_repo.get_context_factor_by_id(context_factor_id)
            if context_factor is None:
                raise HTTPException(status_code=404, detail="ContextFactor not found")
            context_factor = await self.context_factor_repo.update_context_factor(context_factor, context_factor_update)
            return context_factor
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def delete_context_factor(
            self,
            context_factor_id: int
    ) -> dict:
        try:
            context_factor = await self.context_factor_repo.get_context_factor_by_id(context_factor_id)
            if context_factor is None:
                raise HTTPException(status_code=404, detail="ContextFactor not found")

            detail = await self.context_factor_repo.delete_context_factor(context_factor)
            return detail
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
