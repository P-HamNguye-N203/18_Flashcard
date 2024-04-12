from app.models import User
from app.schemas.schema_user import UserBase, UserRepository
from fastapi_sqlalchemy import db

def get_user_id(user_id: int):
    return db.session.query(User).filter(User.Id == user_id).first()

def get_user_name(user_name: str):
    return db.session.query(User).filter(User.Name == user_name).first()

def create_user(user:UserBase):
    User_check = get_user_name(user.Name)
    if User_check:
        return "Ten da ton tai"
    db_user = User(Name=user.Name, password=user.Pass)
    db.session.add(db_user)
    db.session.commit()
    db.session.refresh(db_user)
    return db_user

def get_user():
    return db.session.query(User).all()


    