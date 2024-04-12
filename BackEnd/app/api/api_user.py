from typing import Any

from fastapi import APIRouter, Depends
from fastapi_sqlalchemy import db
from app.schemas.schema_user import UserBase
from app.code_help.user_server import create_user,get_user_name,get_user

router = APIRouter()

@router.post("/create")
def create(userdata: UserBase):
    return create_user(userdata)

@router.get("/listuser")
def list():
    return get_user()

@router.post("/login")
def login(data: UserBase):
    pass