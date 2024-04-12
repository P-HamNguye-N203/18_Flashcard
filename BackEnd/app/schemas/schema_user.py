from typing import Optional

from pydantic import BaseModel

class UserBase(BaseModel):
    Name: Optional[str] = None
    Pass: Optional[str] = None
    
class UserRepository(BaseModel):
    Id: int
    Name: str
    
