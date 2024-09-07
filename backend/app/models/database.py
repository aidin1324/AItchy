from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

DATABASE_URL = "postgresql+asyncpg://postgres:adi44777@localhost:5432/testing"

# Создание асинхронного движка
async_engine = create_async_engine(DATABASE_URL, echo=True)

# Создание асинхронной фабрики сессий
SessionLocal = sessionmaker(bind=async_engine, autocommit=False, autoflush=False, class_=AsyncSession)


async def get_db():
    async with SessionLocal() as session:
        yield session


async def create_all():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

Base = declarative_base()
