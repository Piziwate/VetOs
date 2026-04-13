from sqlalchemy import Column, Integer, String, ForeignKey, JSON, Enum as SQLEnum
import enum
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class RoomType(str, enum.Enum):
    CONSULTATION = "consultation"
    SURGERY = "surgery"
    PRE_OP = "pre_op"
    IMAGING = "imaging"
    HOSPITALIZATION = "hospitalization"

class Room(Base):
    __tablename__ = "room"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(SQLEnum(RoomType), nullable=False)
    clinic_id = Column(Integer, ForeignKey("clinic.id", ondelete="CASCADE"))
    
    # Attributs spécifiques (ex: {"equipement": "radio", "tables": 2})
    attributes = Column(JSON, nullable=True)

    clinic = relationship("Clinic", back_populates="rooms")
    slots = relationship("HospitalizationSlot", back_populates="room", cascade="all, delete-orphan")
