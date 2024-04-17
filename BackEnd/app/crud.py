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
    return db.query(User).filter(User.Email == email).first()

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

def login(db: Session, user: schemas.userLogin):
    db_user = get_user_by_mail(db,user.Mail)
    if not db_user:
        return None
    if not verify_password(user.Password,db_user.Password):
        return None
    return db_user
    
def update_user(db: Session, userId:int, user: schemas.UserCreate):
    db_user = get_user_by_mail(db,user.Mail)
    pass

def create_package(package: schemas.PackageCreate , db: Session):
    db_package = Package(Name= package.Name, UserId= package.UserId)
    db.add(db_package)
    db.commit()
    db.refresh(db_package)
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


def get_packages(userId: int, db: Session):
    return db.query(Package).filter(Package.UserId == userId).all()
