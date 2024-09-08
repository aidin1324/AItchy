from fastapi.exceptions import HTTPException

from repository.effect import EffectRepository
from models.effect import Effect

from schemas.effect import EffectCreate, EffectUpdate


class EffectService:
    def __init__(self, effect_repo: EffectRepository):
        self.effect_repo = effect_repo

    async def get_all_effect(self):
        try:
            effects = await self.effect_repo.get_all_effects()
            return effects
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def get_effect_by_id(
            self,
            effect_id: int
    ) -> Effect:
        try:
            effect = await self.effect_repo.get_effect_by_id(effect_id)
            if effect is None:
                raise HTTPException(status_code=404, detail="Effect not found")
            return effect
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def get_effect_by_name(
            self,
            name: str
    ) -> Effect:
        try:
            effect = await self.effect_repo.get_effect_by_name(name)
            if effect is None:
                raise HTTPException(status_code=404, detail="Effect not found")
            return effect
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def create_effect(
            self,
            effect_create: EffectCreate
    ) -> Effect:
        try:
            effect = await self.effect_repo.get_effect_by_name(effect_create.name)
            if effect is not None:
                raise HTTPException(status_code=409, detail="effect already exists")
            effect = await self.effect_repo.create_effect(effect_create)
            return effect
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def update_effect(
            self,
            effect_id: int,
            effect_update: EffectUpdate
    ) -> Effect:
        try:
            effect = await self.effect_repo.get_effect_by_id(effect_id)
            if effect is None:
                raise HTTPException(status_code=404, detail="Effect not found")
            effect = await self.effect_repo.update_effect(effect, effect_update)
            return effect
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def delete_effect(
            self,
            effect_id: int
    ) -> dict:
        try:
            effect = await self.effect_repo.get_effect_by_id(effect_id)
            if effect is None:
                raise HTTPException(status_code=404, detail="Effect not found")

            detail = await self.effect_repo.delete_effect(effect)
            return detail
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
