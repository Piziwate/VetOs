from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.api.deps import get_db
from app.services.crud_client_patient import patient as crud_patient
from app.schemas.client_patient import Patient, PatientCreate

router = APIRouter()

@router.get("/", response_model=List[Patient])
async def read_patients(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """Retrieve all patients."""
    return await crud_patient.get_multi(db, skip=skip, limit=limit)

@router.post("/", response_model=Patient, status_code=status.HTTP_201_CREATED)
async def create_patient(
    patient_in: PatientCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new patient."""
    return await crud_patient.create(db, obj_in=patient_in)

@router.get("/{patient_id}", response_model=Patient)
async def read_patient(
    patient_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific patient by ID."""
    db_obj = await crud_patient.get(db, id=patient_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_obj
