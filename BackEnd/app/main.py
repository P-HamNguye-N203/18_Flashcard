from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud, models, schemas
from app.db import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users/create", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_name(db, name=user.Name)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/listuser",response_model=List[schemas.User])
def listusers(db: Session = Depends(get_db)):
    return crud.get_users(db=db)

@app.post("/users/login",response_model=schemas.User)
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_name(db, name= user.Name)
    if db_user:
        if db_user.Password != user.Password:
            raise HTTPException(status_code=400, detail="Password False")
        return db_user
    raise HTTPException(status_code=400, detail="Name False")


@app.post("/cards/create",response_model=schemas.Card)
def create_card(card: schemas.CardRequest, db: Session = Depends(get_db)):
    db_package = crud.create_package(name=card.NamePackage, userid=card.UserId, db=db)
    return crud.create_packcard(listcard=card.ListCard, packageId=db_package.id,db=db)

@app.get("/cards/listcard",response_model= List[schemas.Card])
def list_cards_package(package_id:int , db: Session = Depends(get_db)):
    return crud.get_cards(packageId=package_id, db=db)

@app.get("/packages/listpackage",response_model= List[schemas.Package])
def list_packages(user_id:int, db: Session = Depends(get_db)):
    return crud.get_packages(userId=user_id, db=db)
