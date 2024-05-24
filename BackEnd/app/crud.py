from sqlalchemy.orm import Session
from app.models import User, Card, Package
from app import schemas
from typing import Union,Optional,List
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_name(db: Session, name: str):
    return db.query(User).filter(User.Name == name).first()

def get_user_by_mail(db: Session, email: str):
    return db.query(User).filter(User.Mail == email).first()

def get_users(db: Session):
    return db.query(User).all()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_user(db: Session, user: schemas.UserCreate):
    db_user = User(Name=user.Name, Password=get_password_hash(user.Password),Mail=user.Mail)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def login(db: Session, user: schemas.UserLogin):
    db_user = get_user_by_mail(db,user.Mail)
    if not db_user:
        return None
    if not verify_password(user.Password,db_user.Password):
        return None
    return db_user
    
# def update_user(db: Session, userId:int, user: schemas.UserCreate):
#     # chưa code xong 
#     db_user = get_user_by_mail(db,user.Mail)
#     pass

def update_user(db: Session, user_id: int, user: schemas.UserUpdate):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        return None
    
    # Update user attributes if they are provided
    if user.Name:
        db_user.Name = user.Name
    if user.Mail:
        db_user.Mail = user.Mail
    if user.Password:
        db_user.Password = get_password_hash(user.Password)
    
    db.commit()
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        return None
    
    db.delete(db_user)
    db.commit()
    return db_user

def create_package(package: schemas.CreatePackage , db: Session):
    db_package = Package(Name= package.Name, UserId= package.UserId)
    db.add(db_package)
    db.commit()
    # db.refresh(db_package)
    return db_package

def create_packcards(listcard: List[schemas.Card], db: Session, packageId: int):
    try:
        with db.begin():
            for card in listcard:
                db_card = Card(Info=card.Info, Descrip=card.Descrip, PackageId=packageId)
                db.add(db_card)
        db.commit()
        db.refresh(db_card)
    except Exception as e:
        db.rollback()
        raise e
    return db_card

def create_card(card: schemas.Card, PackageId: int, db: Session):
    db_card = Card(Info=card.Info, Descrip=card.Descrip,PackageId=PackageId)
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card

def get_cards(packageId: int,  db: Session):
    return db.query(Card).filter(Card.PackageId == packageId).all()

def update_card(db: Session, card_id: int, card: schemas.CardUpdate):
    db_card = db.query(Card).filter(Card.id == card_id).first()
    if db_card is None:
        return None
    
    # Update card attributes if they are provided
    if card.Info:
        db_card.Info = card.Info
    if card.Descrip:
        db_card.Descrip = card.Descrip
    
    db.commit()
    return db_card

def update_package(db: Session, package_id: int, package: schemas.PackageUpdate):
    db_package = db.query(Package).filter(Package.id == package_id).first()
    if db_package is None:
        return None
    
    # Update package attributes if they are provided
    if package.Name:
        db_package.Name = package.Name
    
    db.commit()
    return db_package

def delete_card(db: Session, card_id: int):
    db_card = db.query(Card).filter(Card.id == card_id).first()
    if db_card is None:
        return None
    
    db.delete(db_card)
    db.commit()
    return db_card

def delete_all_cards(db: Session, package_id: int):
    db_cards = db.query(Card).filter(Card.PackageId == package_id).all()
    if db_cards is None:
        return None
    for card in db_cards:
        db.delete(card)
    db.commit()
    return db_cards

def get_packages(userId: int, db: Session):
    return db.query(Package).filter(Package.UserId == userId).all()

def delete_package(db: Session, package_id: int):
    delete_all_cards(db, package_id)
    db_package = db.query(Package).filter(Package.id == package_id).first()
    if db_package is None:
        return None
    
    db.delete(db_package)
    db.commit()
    return db_package
