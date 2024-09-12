from typing import Annotated
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer

from api.dependencies import get_auth_service
from api.dependencies import get_openai_api_service
from models import User

from services.openai_api import OpenAIAPIService
from services.authentication import AuthenticationService
from schemas.openai_api import ModelResponse

router = APIRouter()

oauth2_scheme_user = OAuth2PasswordBearer(tokenUrl="auth/login/user", scheme_name="user")

CommonAuthService = Annotated[
    AuthenticationService,
    Depends(get_auth_service)
]

CommonOpenAiApiService = Annotated[
    OpenAIAPIService,
    Depends(get_openai_api_service)
]


@router.get(
    "/analyze-entry",
    response_model=ModelResponse,
    summary="Get analyze entry by gpt",
    description="Provide detailed analysis of mood entries based on their content, powered by ChatGpt-4o-mini",
)
async def get_analyze_entry_by_gpt(
        note_id: int,
        auth_service: CommonAuthService,
        openai_api_service: CommonOpenAiApiService,
        token: str = Depends(oauth2_scheme_user),
):
    user: User = await auth_service.get_current_user(token)
    response = await openai_api_service.analyze_daily_entry(
        user=user,
        note_id=note_id
    )
    return response
