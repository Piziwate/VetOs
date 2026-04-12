from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from app.models.client import Client
from app.models.patient import Patient
from app.schemas.client_patient import ClientCreate, ClientUpdate, PatientCreate

class CRUDClient:
    async def get(self, db: AsyncSession, id: int) -> Optional[Client]:
        result = await db.execute(select(Client).filter(Client.id == id))
        return result.scalars().first()

    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Client]:
        result = await db.execute(select(Client).offset(skip).limit(limit))
        return result.scalars().all()

    async def create(self, db: AsyncSession, obj_in: ClientCreate) -> Client:
        db_obj = Client(**obj_in.model_dump())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(self, db: AsyncSession, db_obj: Client, obj_in: ClientUpdate) -> Client:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

class CRUDPatient:
    async def get(self, db: AsyncSession, id: int) -> Optional[Patient]:
        result = await db.execute(select(Patient).filter(Patient.id == id))
        return result.scalars().first()

    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Patient]:
        result = await db.execute(select(Patient).offset(skip).limit(limit))
        return result.scalars().all()

    async def create(self, db: AsyncSession, obj_in: PatientCreate) -> Patient:
        db_obj = Patient(**obj_in.model_dump())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

client = CRUDClient()
patient = CRUDPatient()
