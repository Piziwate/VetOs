from sqlalchemy import Column, Integer, String, ForeignKey, JSON, Enum as SQLEnum
import enum
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class SlotType(str, enum.Enum):
    CAGE = "cage"
    BOX = "box"
    PARC = "parc"

class HospitalizationSlot(Base):
    __tablename__ = "hospitalization_slot"

    id = Column(Integer, primary_key=True, index=True)
    box_reference = Column(String, nullable=False) # ex: "A1", "Cage n°5"
    type = Column(SQLEnum(SlotType), nullable=False)
    room_id = Column(Integer, ForeignKey("room.id", ondelete="CASCADE"))
    
    # Attributs (ex: {"size": "L", "heated": true})
    attributes = Column(JSON, nullable=True)

    room = relationship("Room", back_populates="slots")
