import enum
from sqlalchemy import Column, Integer, String, Boolean, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class StaffRole(str, enum.Enum):
    VET = "vet"
    ASSISTANT = "assistant"
    RECEPTIONIST = "receptionist"
    ADMIN = "admin"
    EXTERNAL = "external"
    STUDENT = "student"

class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(Enum(StaffRole), nullable=False, default=StaffRole.ASSISTANT)
    specialty = Column(String)  # ex: "Chirurgie", "Ostéopathie"
    phone = Column(String)
    is_active = Column(Boolean, default=True)
    
    # Lien Diana (pour l'importation)
    legacy_id = Column(String, unique=True, index=True, nullable=True)
    
    # Lien vers l'utilisateur (optionnel pour les externes sans accès)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=True, unique=True)
    user = relationship("User", backref="staff_profile", uselist=False)

    def __repr__(self):
        return f"<Staff {self.first_name} {self.last_name}>"
