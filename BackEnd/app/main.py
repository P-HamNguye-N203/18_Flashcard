from fastapi import Depends, FastAPI, HTTPException,Query
import sqlalchemy
from sqlalchemy.orm import Session
from typing import List
from app import crud, models, schemas
from app.db import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:5501"
    # Thêm các URL frontend khác nếu cần
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Cho phép tất cả các nguồn
    allow_credentials=True,
    allow_methods=["*"],  # Cho phép tất cả các phương thức (GET, POST, PUT, DELETE, ...)
    allow_headers=["*"],  # Cho phép tất cả các header
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# API tạo user
@app.post("/users/create", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_mail(db, email=user.Mail)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

# API lấy thông tin các user
@app.get("/users/listuser",response_model=List[schemas.User])
def listusers(db: Session = Depends(get_db)):
    return crud.get_users(db=db)

# API đăng nhập
@app.post("/users/login",response_model=schemas.User)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.login(db=db, user=user)
    if not db_user:
        raise HTTPException(status_code=400, detail="Password or Mail False")
    return db_user

# API tạo card
@app.post("/cards/create",response_model=schemas.ResponseModel)
def create_card(card: schemas.CreateCard, db: Session = Depends(get_db)):
    db_cards = crud.create_packcards(listcard=card.ListCards,db=db,packageId=card.PackageId)
    if db_cards:
        return schemas.ResponseModel(Message = "Success")
    return schemas.ResponseModel(Message = "ERROR")

# API lấy thông tin các card
@app.get("/cards/listcard",response_model= List[schemas.Card])
async def list_cards_package(package_id: int = Query(...), db: Session = Depends(get_db)):
    card = crud.get_cards(packageId=package_id, db=db)
    return card

# API lấy thông tin các package
@app.get("/packages/listpackage", response_model=List[schemas.PackageRespon])
async def list_packages(user_id: int = Query(...), db: Session = Depends(get_db)):
    packages = crud.get_packages(userId=user_id, db=db)
    if not isinstance(packages, list):
        raise HTTPException(status_code=422, detail="Expected a list of packages")
    return packages

# @app.post("/cards/add-card",response_model=schemas.ResponseModel)
# def add_card(card: schemas.Card,packageId: int, db: Session = Depends(get_db)):
#     db_card = crud.create_card(card,packageId=packageId,db=db)
#     if db_card:
#         return schemas.ResponseModel(Message="success")
#     return schemas.ResponseModel(Message="ERROR")

# API tạo package
@app.post("/packages/create",response_model=schemas.PackageRespon)
def create_package(package: schemas.CreatePackage, db: Session = Depends(get_db)):
    save_crud = crud.create_package(package, db=db)
    print(save_crud.id)
    return save_crud

# API chỉnh sửa thông tin user
@app.put("/users/update/", response_model=schemas.User)
def update_user(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = crud.update_user(db=db, user_id=user_id, user=user)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# API xóa user
@app.delete("/users/delete", response_model=schemas.ResponseModel)
def delete_user(user: schemas.DeleteUser, db: Session = Depends(get_db)):
    print(f"Request to delete user with ID: {user.user_id}")  # Debug: in ID của người dùng cần xóa

    db_user = crud.delete_user(db=db, user_id=user.user_id)
    print("User deleted:", db_user)  # Debug: in thông tin người dùng đã xóa
    
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return schemas.ResponseModel(Message="Success")

# API chỉnh sửa thông tin card
@app.put("/cards/update", response_model= schemas.Card)
def update_card(card_id: int, card: schemas.CardUpdate, db: Session = Depends(get_db)):
    updated_card = crud.update_card(db=db, card_id=card_id, card=card)
    if updated_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    return updated_card

# API xóa card
@app.delete("/cards/delete", response_model=schemas.ResponseModel)
def delete_card(card_id: int, db: Session = Depends(get_db)):
    delete_card = crud.delete_card(db=db, card_id=card_id)
    if delete_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    return schemas.ResponseModel(Message="Card deleted successfully")

# API xóa tất cả card
@app.delete("/cards/delete_all", response_model=schemas.ResponseModel)
def delete_all_cards(db: Session = Depends(get_db)):
    crud.delete_all_cards(db=db)
    return schemas.ResponseModel(Message="All cards deleted successfully")

# API xóa package
@app.delete("/packages/delete", response_model=schemas.ResponseModel)
def delete_package(package_id: int, db: Session = Depends(get_db)):
    package = crud.get_package(db, package_id=package_id)
    if package is None:
        raise HTTPException(status_code=404, detail="Package not found")
    
    crud.delete_package(db=db, db_package=package)
    return schemas.ResponseModel(Message="Package deleted successfully")


