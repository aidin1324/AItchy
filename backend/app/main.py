""""
Main file to create app
"""

from fastapi import FastAPI
from models.database import Base, engine

Base.metadata.create_all(bind=engine)
app = FastAPI()


@app.get("/")
async def read_root():
    return {"Hello": "World1"}
