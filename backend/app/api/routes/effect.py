from typing import Annotated
from fastapi import APIRouter, Depends

from api.dependencies import get_effect_service
from schemas.effect import EffectResponse
from schemas.effect import EffectCreate, EffectUpdate
from services.effect import EffectService

router = APIRouter()

CommonEffectService = Annotated[
    EffectService,
    Depends(get_effect_service)
]


@router.get(
    "/all",
    response_model=list[EffectResponse],
    summary="Get all effects",
    description="Retrieve information about all existing effects",
)
async def get_all_effects(effect_service: CommonEffectService):
    effects = await effect_service.get_all_effect()
    return effects


@router.get(
    "/by-id",
    response_model=EffectResponse | int,
    summary="Get effect by id",
    description="Retrieve information about a specific effect",
)
async def get_effect_by_id(
        effect_id: int,
        effect_service: CommonEffectService
):
    effect = await effect_service.get_effect_by_id(effect_id)
    return effect


@router.get(
    "/by-name",
    response_model=EffectResponse,
    summary="Get effect by name",
    description="Retrieve information about a specific effect by name",
)
async def get_effect_by_name(
        effect_name: str,
        effect_service: CommonEffectService
):
    effect = await effect_service.get_effect_by_name(effect_name)
    return effect


@router.post(
    "/create",
    response_model=EffectResponse,
    summary="Create effect",
    description="Create a new effect",
)
async def create_effect(
        effect: EffectCreate,
        effect_service: CommonEffectService
):
    effect = await effect_service.create_effect(effect)
    return effect


@router.patch(
    "/update",
    response_model=EffectResponse,
    summary="Update effect",
    description="Update an existing effect",
)
async def update_effect(
        effect_id: int,
        effect_update: EffectUpdate,
        effect_service: CommonEffectService
):
    effect = await effect_service.update_effect(effect_id, effect_update)
    return effect


@router.delete(
    "/delete",
    response_model=dict,
    summary="Delete effect",
    description="Delete an existing effect",
)
async def delete_effect(
        effect_id: int,
        effect_service: CommonEffectService
):
    detail = await effect_service.delete_effect(effect_id)
    return detail
