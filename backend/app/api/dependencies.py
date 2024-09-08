from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from services.mood_content import MoodContentService
from repository.mood_content import MoodContentRepository
from repository.notes import NotesRepository
from services.notes import NotesService
from repository.user import UserRepository
from services.user import UserService
from services.authentication import AuthenticationService
from db.database import get_db


def get_user_repository(conn: AsyncSession = Depends(get_db)) -> UserRepository:
    return UserRepository(conn)

def get_notes_repository(conn: AsyncSession = Depends(get_db)) -> NotesRepository:
    return NotesRepository(conn)

def get_mood_content_repository(conn: AsyncSession = Depends(get_db)) -> MoodContentRepository:
    return MoodContentRepository(conn)

def get_user_service(user_repository: UserRepository = Depends(get_user_repository)) -> UserService:
    return UserService(user_repository)

def get_auth_service(user_service: UserService = Depends(get_user_service)) -> AuthenticationService:
    return AuthenticationService(user_service)

def get_notes_service(notes_repository: NotesRepository = Depends(get_notes_repository)) -> NotesService:
    return NotesService(notes_repository)

def get_mood_content_service(mood_content_repository: MoodContentRepository = Depends(get_mood_content_repository)) -> MoodContentService:
    return MoodContentService(mood_content_repository)
