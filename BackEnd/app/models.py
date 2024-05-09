from sqlalchemy import Column, String, Integer , ForeignKey
from sqlalchemy.orm import relationship

from app.db import Base

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True,autoincrement=True)
    Name = Column(String(100), index=True, nullable=False)
    Mail = Column(String(100), index=True, nullable=False)
    Password = Column(String(255), nullable=False)
    
    Package = relationship('Package', backref='user', lazy = True)
    
class Package(Base):
    __tablename__ = "package"

    id = Column(Integer, primary_key=True,autoincrement=True)
    Name = Column(String(1000))
    UserId = Column(Integer, ForeignKey('user.id'), nullable=False)
    
    Card = relationship('Card', backref='package', lazy = True)
    
class Card(Base):
    __tablename__ = "card"

    id = Column(Integer, primary_key=True,autoincrement=True)
    Info = Column(String(1000))
    Descrip = Column(String(1000))
    PackageId = Column(Integer, ForeignKey('package.id'), nullable=False)