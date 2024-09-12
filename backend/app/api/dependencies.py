from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from repository.user import UserRepository
from services.analytics import AnalyticsService
from services.user import UserService

from services.authentication import AuthenticationService

from repository.mood_content import MoodContentRepository
from services.mood_content import MoodContentService

from repository.notes import NotesRepository
from services.notes import NotesService

from repository.context_factor import ContextFactorRepository
from services.context_factor import ContextFactorService

from repository.emotion import EmotionRepository
from services.emotion import EmotionService

from repository.effect import EffectRepository
from services.effect import EffectService

from repository.mood_context import MoodContextRepository
from services.mood_context import MoodContextService

from repository.mood_emotion import MoodEmotionRepository
from services.mood_emotion import MoodEmotionService

from repository.mood_entry import MoodEntryRepository
from services.mood_entry import MoodEntryService

from services.openai_api import OpenAIAPIService

from db.database import get_db


def get_user_repository(
        conn: AsyncSession = Depends(get_db)
) -> UserRepository:
    return UserRepository(conn)


def get_notes_repository(
        conn: AsyncSession = Depends(get_db)
) -> NotesRepository:
    return NotesRepository(conn)


def get_mood_content_repository(
        conn: AsyncSession = Depends(get_db)
) -> MoodContentRepository:
    return MoodContentRepository(conn)


def get_context_factor_repository(
        conn: AsyncSession = Depends(get_db)
):
    return ContextFactorRepository(conn)


def get_emotion_repository(
        conn: AsyncSession = Depends(get_db)
):
    return EmotionRepository(conn)


def get_effect_repository(
        conn: AsyncSession = Depends(get_db)
):
    return EffectRepository(conn)


def get_mood_context_repository(
        conn: AsyncSession = Depends(get_db)
):
    return MoodContextRepository(conn)


def get_mood_emotion_repository(
        conn: AsyncSession = Depends(get_db)
):
    return MoodEmotionRepository(conn)


def get_mood_entry_repository(
        conn: AsyncSession = Depends(get_db)
):
    return MoodEntryRepository(conn)


"""
    --Starting define services--
"""


def get_user_service(
        user_repository: UserRepository = Depends(get_user_repository)
) -> UserService:
    return UserService(user_repository)


def get_auth_service(
        user_service: UserService = Depends(get_user_service)
) -> AuthenticationService:
    return AuthenticationService(user_service)


def get_notes_service(
        notes_repository: NotesRepository = Depends(get_notes_repository)
) -> NotesService:
    return NotesService(notes_repository)


def get_mood_content_service(
        mood_content_repository: MoodContentRepository = Depends(get_mood_content_repository)
) -> MoodContentService:
    return MoodContentService(mood_content_repository)


def get_context_factor_service(
        context_factor_repository: ContextFactorRepository = Depends(get_context_factor_repository)
):
    return ContextFactorService(context_factor_repository)


def get_emotion_service(
        emotion_repository: EmotionRepository = Depends(get_emotion_repository)
):
    return EmotionService(emotion_repository)


def get_effect_service(
        effect_repository: EffectRepository = Depends(get_effect_repository)
):
    return EffectService(effect_repository)


def get_mood_context_service(
        mood_context_repository: MoodContextRepository = Depends(get_mood_context_repository)
):
    return MoodContextService(mood_context_repository)


def get_mood_emotion_service(
        mood_emotion_repository: MoodEmotionRepository = Depends(get_mood_emotion_repository)
):
    return MoodEmotionService(mood_emotion_repository)


def get_mood_entry_service(
        mood_entry_repository: MoodEntryRepository = Depends(get_mood_entry_repository),
        mood_context_service: MoodContextService = Depends(get_mood_context_service),
        mood_emotion_service: MoodEmotionService = Depends(get_mood_emotion_service)
):
    return MoodEntryService(
        mood_entry_repo=mood_entry_repository,
        mood_context_serv=mood_context_service,
        mood_emotion_serv=mood_emotion_service
    )


def get_analytics_service(
        context_factor_serv: ContextFactorService = Depends(get_context_factor_service),
        effect_service: EffectService = Depends(get_effect_service),
        mood_entry_service: MoodEntryService = Depends(get_mood_entry_service),
        mood_emotion_service: MoodEmotionService = Depends(get_mood_emotion_service),
        emotion_service: EmotionService = Depends(get_emotion_service)
):
    return AnalyticsService(
        context_factor_serv=context_factor_serv,
        effect_serv=effect_service,
        mood_entry_serv=mood_entry_service,
        mood_emotion_serv=mood_emotion_service,
        emotion_serv=emotion_service
    )


def get_openai_api_service(
        note_service: NotesService = Depends(get_notes_service)
):
    return OpenAIAPIService(
        note_serv=note_service
    )
