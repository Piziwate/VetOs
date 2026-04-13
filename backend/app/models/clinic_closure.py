from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class ClinicClosure(Base):
    __tablename__ = "clinic_closure"

    id = Column(Integer, primary_key=True, index=True)
    clinic_id = Column(Integer, ForeignKey("clinic.id", ondelete="CASCADE"))
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    description = Column(String, nullable=True) # ex: "Vacances d'été", "Lundi de Pentecôte"

    clinic = relationship("Clinic", back_populates="closures")
