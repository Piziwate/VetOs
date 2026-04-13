from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.schemas.resource import (
    Clinic, ClinicCreate, Room, RoomCreate, 
    HospitalizationSlot, HospitalizationSlotCreate, StaffAssignment
)
from app.services import crud_resource

router = APIRouter()

# --- Cliniques ---
@router.post("/clinics", response_model=Clinic)
async def create_clinic(clinic_in: ClinicCreate, db: AsyncSession = Depends(deps.get_db)):
    return await crud_resource.create_clinic(db, clinic_in)

@router.get("/clinics", response_model=List[Clinic])
async def get_clinics(db: AsyncSession = Depends(deps.get_db)):
    return await crud_resource.get_clinics(db)

@router.get("/clinics/{clinic_id}", response_model=Clinic)
async def get_clinic(clinic_id: int, db: AsyncSession = Depends(deps.get_db)):
    clinic = await crud_resource.get_clinic_by_id(db, clinic_id)
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinique non trouvée")
    return clinic

# --- Salles ---
@router.post("/rooms", response_model=Room)
async def create_room(room_in: RoomCreate, db: AsyncSession = Depends(deps.get_db)):
    return await crud_resource.create_room(db, room_in)

# --- Slots d'Hospitalisation ---
@router.post("/slots", response_model=HospitalizationSlot)
async def create_slot(slot_in: HospitalizationSlotCreate, db: AsyncSession = Depends(deps.get_db)):
    return await crud_resource.create_hospitalization_slot(db, slot_in)

# --- Assignation Personnel ---
@router.post("/staff-assignments")
async def assign_staff(assignment: StaffAssignment, db: AsyncSession = Depends(deps.get_db)):
    try:
        user = await crud_resource.assign_staff_to_clinics(db, assignment.user_id, assignment.clinic_ids)
        return {"status": "success", "user_id": user.id, "clinics": [c.id for c in user.clinics]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
