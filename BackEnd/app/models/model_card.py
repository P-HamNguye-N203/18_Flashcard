from sqlalchemy import Column, String, Integer , ForeignKey
from app.models.model_base import BareBaseModel
from sqlalchemy.orm import relationship

class Card(BareBaseModel):
    Info = Column(String(1000))
    Descip = Column(String(1000))
    PackageId = Column(Integer, ForeignKey('user.Id'), nullable=False)
    
    
    