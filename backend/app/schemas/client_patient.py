from typing import Optional, List
from pydantic import BaseModel
from datetime import date

# --- Client Schemas ---
class ClientBase(BaseModel):
    first_name: Optional[str] = None
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    zip_code: Optional[str] = None
    favorite_clinic_id: Optional[int] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):
    last_name: Optional[str] = None

class ClientInDBBase(ClientBase):
    id: int
    legacy_id: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True

class Client(ClientInDBBase):
    pass

class ClientPagination(BaseModel):
    items: List[Client]
    total: int

# --- Patient Schemas ---
class PatientBase(BaseModel):
    name: str
    species: Optional[str] = None
    breed: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    microchip_number: Optional[str] = None
    owner_id: int

class PatientCreate(PatientBase):
    pass

class PatientUpdate(PatientBase):
    name: Optional[str] = None
    owner_id: Optional[int] = None

class PatientInDBBase(PatientBase):
    id: int
    legacy_id: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True

class Patient(PatientInDBBase):
    pass

# --- Nested Schemas (for detailed views) ---
class ClientWithPatients(Client):
    patients: List[Patient] = []
