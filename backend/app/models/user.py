import enum
from sqlalchemy import Column, Integer, String, Boolean, Enum
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from app.models.user_clinic import user_clinic_association

class UserRole(str, enum.Enum):
    VET = "vet"
    ASSISTANT = "assistant"
    ADMINISTRATION = "administration"
    TECHNICAL = "technical"

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(Enum(UserRole), default=UserRole.ASSISTANT, nullable=False)

    clinics = relationship("Clinic", secondary=user_clinic_association, back_populates="staff")
