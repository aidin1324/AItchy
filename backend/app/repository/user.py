from sqlalchemy.future import select

from models.user import User
from .base import BaseRepository
from schemas.user import UserCreate, UserUpdate

6
class UserRepository(BaseRepository):

    async def get_user_by_id(self, user_id: int) -> User | None:
        async with self.connection as session:
            result = await session.execute(select(User).filter(User.id == user_id))
            user = result.scalars().first()
        return user

    async def get_user_by_email(self, email: str) -> User | None:
        async with self.connection as session:
            result = await session.execute(select(User).filter(User.email == email))
            user = result.scalars().first()
        return user

    async def create_user(self, user_create: UserCreate, hashed_password) -> User:
        user_create = user_create.dict()
        del user_create["password"]
        user = User(**user_create, hashed_password=hashed_password)

        async with self.connection as session:
            session.add(user)
            await session.commit()
            await session.refresh(user)
        return user

    async def update_user(self, user: User, user_update: UserUpdate) -> User:
        async with self.connection as session:
            update_fields = user_update.dict(exclude_unset=True)  # get rid of None
            for field, value in update_fields.items():
                setattr(user, field, value)
                
            session.add(user)

            await session.commit()
            await session.refresh(user)
        return user

    async def delete_user(self, user: User) -> dict:
        async with self.connection as session:
            await session.delete(user)
            await session.commit()
        return {"detail": "User deleted"}
