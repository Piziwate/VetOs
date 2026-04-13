from typing import List, Optional, Any
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.clinic import Clinic
from app.models.room import Room
from app.models.hospitalization_slot import HospitalizationSlot
from app.models.user import User
from app.schemas.resource import ClinicCreate, RoomCreate, HospitalizationSlotCreate

# --- Cliniques ---
async def create_clinic(db: AsyncSession, clinic_in: ClinicCreate) -> Clinic:
    db_clinic = Clinic(**clinic_in.model_dump())
    db.add(db_clinic)
    await db.commit()
    await db.refresh(db_clinic)
    return db_clinic

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

# --- Salles ---
async def create_room(db: AsyncSession, room_in: RoomCreate) -> Room:
    db_room = Room(**room_in.model_dump())
    db.add(db_room)
    await db.commit()
    await db.refresh(db_room)
    return db_room

# --- Slots d'Hospitalisation ---
async def create_hospitalization_slot(db: AsyncSession, slot_in: HospitalizationSlotCreate) -> HospitalizationSlot:
    db_slot = HospitalizationSlot(**slot_in.model_dump())
    db.add(db_slot)
    await db.commit()
    await db.refresh(db_slot)
    return db_slot

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
