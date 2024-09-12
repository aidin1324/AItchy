from datetime import date
from typing import Annotated
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer

from api.dependencies import get_analytics_service
from api.dependencies import get_auth_service
from models import User

from services.analytics import AnalyticsService
from services.authentication import AuthenticationService

router = APIRouter()

oauth2_scheme_user = OAuth2PasswordBearer(tokenUrl="auth/login/user", scheme_name="user")

CommonAuthService = Annotated[
    AuthenticationService,
    Depends(get_auth_service)
]

CommonAnalyticsService = Annotated[
    AnalyticsService,
    Depends(get_analytics_service)
]


@router.get(
    "/by-date",
    response_model=dict,
    summary="Get mood_entries by date",
    description="Retrieve information about mood_entries by date with pagination",
)
async def get_analytics_mood_entry_by_date(
        auth_service: CommonAuthService,
        analytics_service: CommonAnalyticsService,
        token: str = Depends(oauth2_scheme_user),
        start_date: date | None = None,
        end_date: date | None = None,
        delete_name: str | None = None
):
    user: User = await auth_service.get_current_user(token)
    paginated_analytics = await analytics_service.get_analytics(
        user_id=user.id,
        start_date=start_date,
        end_date=end_date,
        delete_names=delete_name.split(".") if delete_name else None
    )
    return paginated_analytics
