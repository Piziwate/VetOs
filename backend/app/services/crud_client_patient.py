from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_, func, desc, asc
from sqlalchemy.orm import selectinload
from typing import List, Optional, Tuple
from app.models.client import Client
from app.models.patient import Patient
from app.schemas.client_patient import ClientCreate, ClientUpdate, PatientCreate

class CRUDClient:
    async def get(self, db: AsyncSession, id: int) -> Optional[Client]:
        result = await db.execute(select(Client).filter(Client.id == id))
        return result.scalars().first()

    async def get_with_patients(self, db: AsyncSession, id: int) -> Optional[Client]:
        result = await db.execute(
            select(Client)
            .filter(Client.id == id)
            .options(selectinload(Client.patients))
        )
        return result.scalars().first()

    async def get_multi_paginated(
        self, 
        db: AsyncSession, 
        *, 
        skip: int = 0, 
        limit: int = 100,
        search: Optional[str] = None,
        sort_by: str = "last_name",
        sort_order: str = "asc"
    ) -> Tuple[List[Client], int]:
        query = select(Client)
        
        # Global Search
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                or_(
                    Client.first_name.ilike(search_filter),
                    Client.last_name.ilike(search_filter),
                    Client.email.ilike(search_filter),
                    Client.phone.ilike(search_filter),
                    Client.city.ilike(search_filter),
                    Client.legacy_id.ilike(search_filter)
                )
            )
        
        # Total count for pagination
        count_query = select(func.count()).select_from(query.subquery())
        total_count_result = await db.execute(count_query)
        total_count = total_count_result.scalar_one()

        # Sorting
        sort_column = getattr(Client, sort_by, Client.last_name)
        if sort_order == "desc":
            query = query.order_by(desc(sort_column))
        else:
            query = query.order_by(asc(sort_column))

        # Pagination
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all(), total_count

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
