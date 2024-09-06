""""
Main file to create app
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.database import create_all, async_engine

from api.routes.main import api_router
import asyncio

app = FastAPI()

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


@app.on_event("startup")
async def startup():
    await create_all()


@app.on_event("shutdown")
async def shutdown():
    await async_engine.dispose()
