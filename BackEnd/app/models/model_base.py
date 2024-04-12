from datetime import datetime
from sqlalchemy import Column, Integer, DateTime
from sqlalchemy.ext.declarative import as_declarative , declared_attr

# tạo 1 lớp ánh xạ định nghĩa các đối tượng chung cho các lớp chung khác kế thừa
@as_declarative()
class Base:
    __abstract__ = True
    __name__ : str

    # Tạo tên table tự động 
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()

# Đây là table cho các table khác kế thừa với biến __abstract__ = True table này sẽ không được tạo trong database
class BareBaseModel(Base):
    __abstract__ = True
    Id = Column(Integer, primary_key=True, autoincrement=True)
    CreatedAt = Column(DateTime, default=datetime.now)
    UpdatedAt = Column(DateTime, default=datetime.now, onupdate=datetime.now)