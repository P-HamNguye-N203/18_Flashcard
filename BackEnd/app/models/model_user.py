from sqlalchemy import Column, String, Boolean, DateTime , Enum , Integer
from datetime import datetime
from app.models.model_base import BareBaseModel
from sqlalchemy.orm import relationship

class User(BareBaseModel):
    Name = Column(String(100), index=True, nullable=False)
    Pass = Column(String(255), nullable=False, unique=True)
    
    Package = relationship('Package', backref='user', lazy = True)