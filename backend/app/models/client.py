from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Client(Base):
    id = Column(Integer, primary_key=True, index=True)
    legacy_id = Column(String, index=True, nullable=True)  # For MSSQL migration tracking
    first_name = Column(String)
    last_name = Column(String, index=True)
    email = Column(String, index=True)
    phone = Column(String)
    address = Column(String)
    city = Column(String)
    zip_code = Column(String)
    is_active = Column(Boolean, default=True)
    
    patients = relationship("Patient", back_populates="owner")
