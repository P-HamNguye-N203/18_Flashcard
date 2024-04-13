from sqlalchemy.orm import Session
from app.models import User, Card, Package
from app import schemas

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_name(db: Session, name: str):
    return db.query(User).filter(User.Name == name).first()


def get_users(db: Session):
    return db.query(User).all()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = User(Name=user.Name, Password=user.Password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_package(name: str, userid:int , db: Session):
    db_package = Package(Name= name, UserId= userid)
    db.add(db_package)
    db.commit()
    db.refresh(db_package)
    return db_package

def create_packcard(listcard: schemas.CreateCard, packageId: int, db: Session):
    for card in listcard:
        db_card = Card(Info=card.Info, Descrip = card.Descrip, PackageId = packageId)
        db.add(db_card)
        db.commit()
        db.refresh(db_card)
    return db_card

def get_cards(packageId: int,  db: Session):
    return db.query(Card).filter(Card.PackageId == packageId).all()


def get_packages(userId: int, db: Session):
    return db.query(Package).filter(Package.UserId == userId).all()
            
    

