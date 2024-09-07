from fastapi.security import OAuth2PasswordRequestForm
from fastapi.exceptions import HTTPException

from schemas.token import Token
from schemas.user import UserCreate

from models.user import User
from .user import UserService
from .security import create_access_token, verify_access_token, verify_password


class AuthenticationService:
    def __init__(self, user_service: UserService):
        self.user_service = user_service

    async def register(self, user_create: UserCreate, expires_data: int = None) -> Token:
        user = await self.user_service.create_user(user_create)
        encoded_jwt = create_access_token(
            data={
                "user_id": user.id,
                "is_superuser": user.is_superuser,
                "is_premium": user.is_premium
            },
            expires_delta=expires_data
        )
        return Token(access_token=encoded_jwt, token_type="bearer")

    async def login(self, user_login: OAuth2PasswordRequestForm) -> Token:
        user = await self.user_service.get_user_by_email(user_login.username)
        if not verify_password(user_login.password, user.hashed_password):
            raise HTTPException(
                status_code=401,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        encoded_jwt = create_access_token(
            data={
                "user_id": user.id,
                "is_superuser": user.is_superuser,
                "is_premium": user.is_premium
            }
        )
        return Token(access_token=encoded_jwt, token_type="bearer")

    async def get_current_user(
            self,
            token: str,
            credentials_exception=HTTPException(
                401,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    ) -> User:
        token = verify_access_token(token, credentials_exception)
        user = await self.user_service.get_user_by_id(token.user_id)
        return user

    async def get_current_superuser(
            self,
            token: str,
            credentials_exception=HTTPException(
                401,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    ) -> User:
        token = verify_access_token(token, credentials_exception)
        user = await self.user_service.get_user_by_id(token.user_id)

        if not token.is_superuser:
            raise HTTPException(
                403,
                detail="You do not have sufficient permissions to perform this action"
            )
        return user

    async def get_current_premium_user(
            self,
            token: str,
            credentials_exception=HTTPException(
                401,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    ) -> User:
        token = verify_access_token(token, credentials_exception)
        user = await self.user_service.get_user_by_id(token.user_id)

        if not token.is_premium:
            raise HTTPException(
                403,
                detail="You do not have sufficient permissions to access this resource."
            )
        return user
