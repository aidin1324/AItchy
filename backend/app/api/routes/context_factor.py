from typing import Annotated
from fastapi import APIRouter, Depends

from api.dependencies import get_context_factor_service
from schemas.context_factor import ContextFactorResponse
from schemas.context_factor import ContextFactorCreate, ContextFactorUpdate
from services.context_factor import ContextFactorService

router = APIRouter()

CommonContextFactorService = Annotated[
    ContextFactorService,
    Depends(get_context_factor_service)
]


@router.get(
    "/all",
    response_model=list[ContextFactorResponse],
    summary="Get all context_factors",
    description="Retrieve information about all existing context_factors",
)
async def get_all_context_factors(context_factor_service: CommonContextFactorService):
    context_factors = await context_factor_service.get_all_context_factor()
    return context_factors


@router.get(
    "/by-id",
    response_model=ContextFactorResponse,
    summary="Get context_factor by id",
    description="Retrieve information about a specific context_factor",
)
async def get_context_factor_by_id(
        context_factor_id: int,
        context_factor_service: CommonContextFactorService
):
    context_factor = await context_factor_service.get_context_factor_by_id(context_factor_id)
    return context_factor


@router.get(
    "/by-name",
    response_model=ContextFactorResponse,
    summary="Get context_factor by name",
    description="Retrieve information about a specific context_factor by name",
)
async def get_context_factor_by_name(
        context_factor_name: str,
        context_factor_service: CommonContextFactorService
):
    context_factor = await context_factor_service.get_context_factor_by_name(context_factor_name)
    return context_factor


@router.post(
    "/create",
    response_model=ContextFactorResponse,
    summary="Create context_factor",
    description="Create a new context_factor",
)
async def create_context_factor(
        context_factor: ContextFactorCreate,
        context_factor_service: CommonContextFactorService
):
    context_factor = await context_factor_service.create_context_factor(context_factor)
    return context_factor


@router.patch(
    "/update",
    response_model=ContextFactorResponse,
    summary="Update context_factor",
    description="Update an existing context_factor",
)
async def update_context_factor(
        context_factor_id: int,
        context_factor_update: ContextFactorUpdate,
        context_factor_service: CommonContextFactorService
):
    context_factor = await context_factor_service.update_context_factor(context_factor_id, context_factor_update)
    return context_factor


@router.delete(
    "/delete",
    response_model=dict,
    summary="Delete context_factor",
    description="Delete an existing context_factor",
)
async def delete_context_factor(
        context_factor_id: int,
        context_factor_service: CommonContextFactorService
):
    detail = await context_factor_service.delete_context_factor(context_factor_id)
    return detail
