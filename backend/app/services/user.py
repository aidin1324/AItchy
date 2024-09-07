from fastapi.exceptions import HTTPException

from repository.user import UserRepository
from models.user import User

from schemas.user import UserCreate, UserUpdate
from .security import get_password_hash


class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def get_user_by_id(self, user_id: int) -> User:
        user = await self.user_repo.get_user_by_id(user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    async def get_user_by_email(self, email: str) -> User:
        user = await self.user_repo.get_user_by_email(email)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    async def create_user(self, user_create: UserCreate) -> User:
        user = await self.user_repo.get_user_by_email(user_create.email)
        if user is not None:
            raise HTTPException(status_code=409, detail="user already exists")
        hashed_password = get_password_hash(user_create.password)
        user = await self.user_repo.create_user(user_create, hashed_password)
        return user

    async def update_user(self, user_id, user_update: UserUpdate) -> User:
        user = await self.user_repo.get_user_by_id(user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        user = await self.user_repo.update_user(user, user_update)
        return user

    async def delete_user(self, user_id: int) -> dict:
        user = await self.user_repo.get_user_by_id(user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        detail = await self.user_repo.delete_user(user)
        return detail
