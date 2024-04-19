from typing import Union,Optional,List

from pydantic import BaseModel

class UserBase(BaseModel):
    Name: str

class UserCreate(UserBase):
    Mail: str
    Password: str

class User(UserBase):
    id: int
    Mail: str

    class Config:
        orm_mode = True
        
class userLogin(BaseModel):
    Mail: str
    Password: str
        
class Card(BaseModel):
    Info: str
    Descrip: str

class CardRepons(BaseModel):
    Info: str
    Descrip: str
    id : int
    PackageId: int 
    
class CreatePackage(BaseModel):
    UserId: int
    Name: str
    
class PackageRespon(BaseModel):
    Name: str
    PackageId: int
        
class PackageCreate(BaseModel):
    Name: str
    UserId: int
    
class ResponseModel(BaseModel):
    Message: str
    
class CreateCard(BaseModel):
    ListCards: List[Card]
    PackageId: int
    
