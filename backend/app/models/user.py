import enum
from sqlalchemy import Column, Integer, String, Boolean, Enum
from app.db.base_class import Base

class UserRole(str, enum.Enum):
    VET = "vet"
    ASSISTANT = "assistant"
    ADMINISTRATION = "administration"
    TECHNICAL = "technical"

class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(Enum(UserRole), default=UserRole.ASSISTANT, nullable=False)
