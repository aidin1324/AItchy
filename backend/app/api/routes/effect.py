import logging
from typing import Annotated
from fastapi import APIRouter, Depends, Security

from api.dependencies import get_effect_service
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
from schemas.effect import EffectResponse
from schemas.effect import EffectCreate, EffectUpdate
from services.effect import EffectService

from services.authentication import AuthenticationService

from api.dependencies import get_auth_service

router = APIRouter()

CommonEffectService = Annotated[
    EffectService,
    Depends(get_effect_service)
]
CommonAuthService = Annotated[AuthenticationService, Depends(get_auth_service)]

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="auth/login/user",
    scopes={
        "user": "Read information about effects.",
        "premium": "Create and update effects.",
        "admin": "Full access to effects, including deletion."
    }
)



@router.get(
    "/all",
    response_model=list[EffectResponse],
    summary="Get all effects",
    description="Retrieve information about all existing effects",
)
async def get_all_effects(
        effect_service: CommonEffectService,
        auth_service: CommonAuthService,
        token: str = Security(oauth2_scheme, scopes=["premium"])):

    await auth_service.get_current_user(SecurityScopes(["premium"]), token)
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
