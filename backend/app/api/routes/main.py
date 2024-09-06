from fastapi import APIRouter

from api.routes import authentication

api_router = APIRouter()

api_router.include_router(
    authentication.router,
    tags=['Authentication'],
    prefix="/auth"
)
