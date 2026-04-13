from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import time, date
from enum import Enum

# --- Fermetures ---
class ClinicClosureBase(BaseModel):
    start_date: date
    end_date: date
    description: Optional[str] = None

class ClinicClosureCreate(ClinicClosureBase):
    clinic_id: int

class ClinicClosure(ClinicClosureBase):
    id: int
    clinic_id: int
    class Config:
        from_attributes = True

# --- Horaires ---
class OpeningHoursSlot(BaseModel):
    open: str = Field(..., pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$")
    close: str = Field(..., pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$")

class OpeningHours(BaseModel):
    monday: List[OpeningHoursSlot] = []
    tuesday: List[OpeningHoursSlot] = []
    wednesday: List[OpeningHoursSlot] = []
    thursday: List[OpeningHoursSlot] = []
    friday: List[OpeningHoursSlot] = []
    saturday: List[OpeningHoursSlot] = []
    sunday: List[OpeningHoursSlot] = []

# --- Hospitalisation ---
class SlotType(str, Enum):
    CAGE = "cage"
    BOX = "box"
    PARC = "parc"

class HospitalizationSlotBase(BaseModel):
    box_reference: str
    type: SlotType
    attributes: Optional[Dict[str, Any]] = None

class HospitalizationSlotCreate(HospitalizationSlotBase):
    room_id: int

class HospitalizationSlotUpdate(BaseModel):
    box_reference: Optional[str] = None
    type: Optional[SlotType] = None
    attributes: Optional[Dict[str, Any]] = None

class HospitalizationSlot(HospitalizationSlotBase):
    id: int
    room_id: int
    class Config:
        from_attributes = True

# --- Salles ---
class RoomType(str, Enum):
    CONSULTATION = "consultation"
    SURGERY = "surgery"
    PRE_OP = "pre_op"
    IMAGING = "imaging"
    HOSPITALIZATION = "hospitalization"

class RoomBase(BaseModel):
    name: str
    type: RoomType
    attributes: Optional[Dict[str, Any]] = None

class RoomCreate(RoomBase):
    clinic_id: int

class RoomUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[RoomType] = None
    attributes: Optional[Dict[str, Any]] = None

class Room(RoomBase):
    id: int
    clinic_id: int
    slots: List[HospitalizationSlot] = []
    class Config:
        from_attributes = True

# --- Cliniques ---
class ClinicBase(BaseModel):
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    opening_hours: Optional[OpeningHours] = None

class ClinicCreate(ClinicBase):
    pass

class ClinicUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    opening_hours: Optional[OpeningHours] = None

class Clinic(ClinicBase):
    id: int
    rooms: List[Room] = []
    class Config:
        from_attributes = True

# --- Assignation Personnel ---
class StaffAssignment(BaseModel):
    user_id: int
    clinic_ids: List[int]
