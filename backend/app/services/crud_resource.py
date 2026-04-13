from typing import List, Optional, Any
from sqlalchemy.future import select
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.clinic import Clinic
from app.models.room import Room
from app.models.hospitalization_slot import HospitalizationSlot
from app.models.user import User
from app.schemas.resource import (
    ClinicCreate, ClinicUpdate, 
    RoomCreate, RoomUpdate, 
    HospitalizationSlotCreate, HospitalizationSlotUpdate
)

# --- Cliniques ---
async def create_clinic(db: AsyncSession, clinic_in: ClinicCreate) -> Clinic:
    db_clinic = Clinic(**clinic_in.model_dump())
    db.add(db_clinic)
    await db.commit()
    
    # Re-récupérer avec les relations chargées pour éviter l'erreur de validation FastAPI
    return await get_clinic_by_id(db, db_clinic.id)

async def get_clinics(db: AsyncSession) -> List[Clinic]:
    result = await db.execute(
        select(Clinic).options(
            selectinload(Clinic.rooms).selectinload(Room.slots)
        )
    )
    return result.scalars().all()

async def get_clinic_by_id(db: AsyncSession, clinic_id: int) -> Optional[Clinic]:
    result = await db.execute(
        select(Clinic)
        .filter(Clinic.id == clinic_id)
        .options(selectinload(Clinic.rooms).selectinload(Room.slots))
    )
    return result.scalars().first()

async def update_clinic(db: AsyncSession, clinic_id: int, clinic_in: ClinicUpdate) -> Optional[Clinic]:
    clinic = await get_clinic_by_id(db, clinic_id)
    if not clinic:
        return None
    
    update_data = clinic_in.model_dump(exclude_unset=True)
    if update_data.get('opening_hours') and isinstance(update_data['opening_hours'], dict):
        pass # It's okay, handled by JSON column

    for field, value in update_data.items():
        setattr(clinic, field, value)
        
    await db.commit()
    return await get_clinic_by_id(db, clinic_id)

async def delete_clinic(db: AsyncSession, clinic_id: int) -> bool:
    clinic = await get_clinic_by_id(db, clinic_id)
    if not clinic:
        return False
    await db.delete(clinic)
    await db.commit()
    return True

# --- Salles ---
async def create_room(db: AsyncSession, room_in: RoomCreate) -> Room:
    db_room = Room(**room_in.model_dump())
    db.add(db_room)
    await db.commit()
    
    result = await db.execute(
        select(Room).filter(Room.id == db_room.id).options(selectinload(Room.slots))
    )
    return result.scalars().first()

async def update_room(db: AsyncSession, room_id: int, room_in: RoomUpdate) -> Optional[Room]:
    result = await db.execute(select(Room).filter(Room.id == room_id).options(selectinload(Room.slots)))
    room = result.scalars().first()
    if not room:
        return None
        
    update_data = room_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(room, field, value)
        
    await db.commit()
    await db.refresh(room)
    return room

async def delete_room(db: AsyncSession, room_id: int) -> bool:
    result = await db.execute(select(Room).filter(Room.id == room_id))
    room = result.scalars().first()
    if not room:
        return False
    await db.delete(room)
    await db.commit()
    return True

# --- Slots d'Hospitalisation ---
async def create_hospitalization_slot(db: AsyncSession, slot_in: HospitalizationSlotCreate) -> HospitalizationSlot:
    db_slot = HospitalizationSlot(**slot_in.model_dump())
    db.add(db_slot)
    await db.commit()
    await db.refresh(db_slot)
    return db_slot

async def update_hospitalization_slot(db: AsyncSession, slot_id: int, slot_in: HospitalizationSlotUpdate) -> Optional[HospitalizationSlot]:
    result = await db.execute(select(HospitalizationSlot).filter(HospitalizationSlot.id == slot_id))
    slot = result.scalars().first()
    if not slot:
        return None
        
    update_data = slot_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(slot, field, value)
        
    await db.commit()
    await db.refresh(slot)
    return slot

async def delete_hospitalization_slot(db: AsyncSession, slot_id: int) -> bool:
    result = await db.execute(select(HospitalizationSlot).filter(HospitalizationSlot.id == slot_id))
    slot = result.scalars().first()
    if not slot:
        return False
    await db.delete(slot)
    await db.commit()
    return True

# --- Assignation Personnel ---
async def assign_staff_to_clinics(db: AsyncSession, user_id: int, clinic_ids: List[int]) -> User:
    # Récupérer l'utilisateur avec ses cliniques actuelles
    result = await db.execute(
        select(User)
        .filter(User.id == user_id)
        .options(selectinload(User.clinics))
    )
    user = result.scalars().first()
    if not user:
        raise Exception("Utilisateur non trouvé")

    # Récupérer les cliniques à assigner
    result = await db.execute(
        select(Clinic).filter(Clinic.id.in_(clinic_ids))
    )
    clinics = result.scalars().all()
    
    user.clinics = clinics
    await db.commit()
    await db.refresh(user)
    return user
