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
    db_user = crud.get_user_by_mail(db, name=user.Mail)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/listuser",response_model=List[schemas.User])
def listusers(db: Session = Depends(get_db)):
    return crud.get_users(db=db)

@app.post("/users/login",response_model=schemas.User)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.login(db=db, user=user)
    if db_user:
        raise HTTPException(status_code=400, detail="Password or Mail False")
    return db_user

@app.post("/cards/create",response_model=schemas.ResponseModel)
def create_card(card: schemas.CreateCard, db: Session = Depends(get_db)):
    db_cards = crud.create_packcards(listcard=card.ListCard,db=db,packageId=card.PackageId)
    if db_cards:
        return schemas.ResponseModel(Message = "Success")
    return schemas.ResponseModel(Message = "ERROR")

@app.get("/cards/listcard",response_model= List[schemas.Card])
def list_cards_package(package_id:int , db: Session = Depends(get_db)):
    return crud.get_cards(packageId=package_id, db=db)

@app.get("/packages/listpackage",response_model= List[schemas.Package])
def list_packages(user_id:int, db: Session = Depends(get_db)):
    return crud.get_packages(userId=user_id, db=db)

@app.post("/cards/add-card",response_model=schemas.ResponseModel)
def add_card(card: schemas.Card,packageId: int, db: Session = Depends(get_db)):
    db_card = crud.create_card(card,packageId=packageId,db=db)
    if db_card:
        return schemas.ResponseModel(Message="success")
    return schemas.ResponseModel(Message="ERROR")

@app.post("/packages/create",response_model=schemas.PackageRespon)
def create_package(package: schemas.CreatePackage, db: Session = Depends(get_db)):
    return crud.create_package(package, db=db)

@app.put("/users/update")
def update_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    pass

@app.delete("/users/detele")
def delete_user(user: schemas.User, db: Session = Depends(get_db)):
    pass

@app.put("/cards/update")
def update_card(card: schemas.Card, db: Session = Depends(get_db)):
    pass

@app.delete("/cards/delete")
def delete_card(id: int,db: Session = Depends(get_db)):
    pass

@app.delete("/cards/delete_all")
def delete_all_cards(db: Session = Depends(get_db)):
    pass

@app.delete("/package/delete")
def delete_package(db: Session = Depends(get_db)):
    pass


