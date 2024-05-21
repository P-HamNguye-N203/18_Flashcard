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
        
class UserLogin(BaseModel):
    Mail: str
    Password: str
        
class Card(BaseModel):
    id: int
    Info: str
    Descrip: str

class CardUpdate(BaseModel):
    Info: Optional[str] = None
    Descrip: Optional[str] = None

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
    id: int

class PackageUpdate(BaseModel):
    Name: Optional[str] = None

class UserId(BaseModel):
    id: int
        
class ResponseModel(BaseModel):
    Message: str
    
class CreateCard(BaseModel):
    ListCards: List[Card]
    PackageId: int

class UserUpdate(BaseModel):
    Name: Optional[str] = None
    Mail: Optional[str] = None
    Password: Optional[str] = None
    
class DeleteUser(BaseModel):
    user_id: int
