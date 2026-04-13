from pydantic import BaseModel
from typing import Optional
from app.models.staff import StaffRole

class StaffBase(BaseModel):
    first_name: str
    last_name: str
    role: StaffRole = StaffRole.ASSISTANT
    specialty: Optional[str] = None
    phone: Optional[str] = None
    is_active: bool = True
    legacy_id: Optional[str] = None

class StaffCreate(StaffBase):
    user_id: Optional[int] = None

class StaffUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[StaffRole] = None
    specialty: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None
    user_id: Optional[int] = None

class Staff(StaffBase):
    id: int
    user_id: Optional[int] = None

    class Config:
        from_attributes = True
