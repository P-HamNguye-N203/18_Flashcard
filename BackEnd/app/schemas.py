from typing import Union,Optional,List

from pydantic import BaseModel

class UserBase(BaseModel):
    Name: str


class UserCreate(UserBase):
    Password: str


class User(UserBase):
    id: int

    class Config:
        orm_mode = True
        
class Card(BaseModel):
    Info: str
    Descrip: str

class CardRequest(BaseModel):
    ListCard: List[Card]
    NamePackage: str
    UserId: int    
    
class CreatePackage(BaseModel):
    UserId: int
    Name: str
    
class Package(BaseModel):
    Name: str
    PackageId: int
    
    
class CreateCard(BaseModel):
    ListCard: List[Card]