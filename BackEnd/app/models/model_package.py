from sqlalchemy import Column, String, Boolean, DateTime , Enum , Integer, ForeignKey
from datetime import datetime
from app.models.model_base import BareBaseModel
from sqlalchemy.orm import relationship

class Package(BareBaseModel):
    Name = Column(String(1000))
    UserId = Column(Integer, ForeignKey('user.Id'), nullable=False)
    
    Card = relationship('Card', backref='package', lazy = True)