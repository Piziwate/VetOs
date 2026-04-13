from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.schemas.resource import (
    Clinic, ClinicCreate, ClinicUpdate,
    Room, RoomCreate, RoomUpdate,
    HospitalizationSlot, HospitalizationSlotCreate, HospitalizationSlotUpdate,
    ClinicClosure, ClinicClosureCreate,
    StaffAssignment
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

@router.put("/clinics/{clinic_id}", response_model=Clinic)
async def update_clinic(clinic_id: int, clinic_in: ClinicUpdate, db: AsyncSession = Depends(deps.get_db)):
    clinic = await crud_resource.update_clinic(db, clinic_id, clinic_in)
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinique non trouvée")
    return clinic

@router.delete("/clinics/{clinic_id}")
async def delete_clinic(clinic_id: int, db: AsyncSession = Depends(deps.get_db)):
    success = await crud_resource.delete_clinic(db, clinic_id)
    if not success:
        raise HTTPException(status_code=404, detail="Clinique non trouvée")
    return {"status": "success"}

# --- Salles ---
@router.post("/rooms", response_model=Room)
async def create_room(room_in: RoomCreate, db: AsyncSession = Depends(deps.get_db)):
    return await crud_resource.create_room(db, room_in)

@router.put("/rooms/{room_id}", response_model=Room)
async def update_room(room_id: int, room_in: RoomUpdate, db: AsyncSession = Depends(deps.get_db)):
    room = await crud_resource.update_room(db, room_id, room_in)
    if not room:
        raise HTTPException(status_code=404, detail="Salle non trouvée")
    return room

@router.delete("/rooms/{room_id}")
async def delete_room(room_id: int, db: AsyncSession = Depends(deps.get_db)):
    success = await crud_resource.delete_room(db, room_id)
    if not success:
        raise HTTPException(status_code=404, detail="Salle non trouvée")
    return {"status": "success"}

# --- Slots d'Hospitalisation ---
@router.post("/slots", response_model=HospitalizationSlot)
async def create_slot(slot_in: HospitalizationSlotCreate, db: AsyncSession = Depends(deps.get_db)):
    return await crud_resource.create_hospitalization_slot(db, slot_in)

@router.put("/slots/{slot_id}", response_model=HospitalizationSlot)
async def update_slot(slot_id: int, slot_in: HospitalizationSlotUpdate, db: AsyncSession = Depends(deps.get_db)):
    slot = await crud_resource.update_hospitalization_slot(db, slot_id, slot_in)
    if not slot:
        raise HTTPException(status_code=404, detail="Slot non trouvé")
    return slot

@router.delete("/slots/{slot_id}")
async def delete_slot(slot_id: int, db: AsyncSession = Depends(deps.get_db)):
    success = await crud_resource.delete_hospitalization_slot(db, slot_id)
    if not success:
        raise HTTPException(status_code=404, detail="Slot non trouvé")
    return {"status": "success"}

# --- Fermetures ---
@router.post("/closures", response_model=ClinicClosure)
async def create_closure(closure_in: ClinicClosureCreate, db: AsyncSession = Depends(deps.get_db)):
    return await crud_resource.create_clinic_closure(db, closure_in)

@router.delete("/closures/{closure_id}")
async def delete_closure(closure_id: int, db: AsyncSession = Depends(deps.get_db)):
    success = await crud_resource.delete_clinic_closure(db, closure_id)
    if not success:
        raise HTTPException(status_code=404, detail="Fermeture non trouvée")
    return {"status": "success"}

# --- Assignation Personnel ---
@router.post("/staff-assignments")
async def assign_staff(assignment: StaffAssignment, db: AsyncSession = Depends(deps.get_db)):
    try:
        user = await crud_resource.assign_staff_to_clinics(db, assignment.user_id, assignment.clinic_ids)
        return {"status": "success", "user_id": user.id, "clinics": [c.id for c in user.clinics]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
