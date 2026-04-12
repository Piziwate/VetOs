from sqlalchemy import Column, Integer, String, ForeignKey, Date, Boolean
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Patient(Base):
    id = Column(Integer, primary_key=True, index=True)
    legacy_id = Column(String, index=True, nullable=True)  # For MSSQL migration tracking
    name = Column(String, index=True, nullable=False)
    species = Column(String, index=True)
    breed = Column(String, index=True)
    gender = Column(String)
    date_of_birth = Column(Date)
    microchip_number = Column(String, unique=True, index=True)
    is_active = Column(Boolean, default=True)
    
    owner_id = Column(Integer, ForeignKey("client.id"))
    owner = relationship("Client", back_populates="patients")
