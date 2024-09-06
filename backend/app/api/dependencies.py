from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from repository.user import UserRepository
from services.user import UserService
from services.authentication import AuthenticationService
from models.database import get_db


def get_user_repository(conn: AsyncSession = Depends(get_db)) -> UserRepository:
    return UserRepository(conn)


def get_user_service(user_repository: UserRepository = Depends(get_user_repository)) -> UserService:
    return UserService(user_repository)


def get_auth_service(user_service: UserService = Depends(get_user_service)) -> AuthenticationService:
    return AuthenticationService(user_service)
