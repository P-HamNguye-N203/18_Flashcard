from sqlalchemy import create_engine
from fastapi import Depends, FastAPI, HTTPException, Request, Response
from sqlalchemy.orm import Session
from app.models import Base
# from app.core.config import settings 
from app.api.api_router import router
from app.db.base import engine
from fastapi_sqlalchemy import DBSessionMiddleware
from starlette.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)


app = FastAPI()

app.include_router(router, prefix='')
app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in ['*']],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
app.add_middleware(DBSessionMiddleware, db_url="sqlite:///./sql_app.db")


