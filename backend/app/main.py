""""
Main file to create app
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import create_all, async_engine

from api.routes.main import api_router
import asyncio

@asynccontextmanager
async def lifespan(app: FastAPI):
    # on startup
    await create_all()
    try:
        yield
    finally:
        #on shutdown
        await async_engine.dispose()

app = FastAPI(lifespan=lifespan)

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


