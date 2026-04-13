from sqlalchemy import Column, Integer, String, JSON
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Clinic(Base):
    __tablename__ = "clinic"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    address = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    
    # Structure JSON: {"monday": [{"open": "08:00", "close": "12:00"}], ...}
    opening_hours = Column(JSON, nullable=True)
    
    rooms = relationship("Room", back_populates="clinic", cascade="all, delete-orphan")
    staff = relationship("User", secondary="user_clinic", back_populates="clinics")
