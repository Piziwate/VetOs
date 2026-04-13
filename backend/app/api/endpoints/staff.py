from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.api import deps
from app.services import crud_staff
from app.schemas import staff as staff_schema

router = APIRouter()

@router.get("/", response_model=List[staff_schema.Staff])
def read_staff(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve staff members.
    """
    staff_members = crud_staff.staff.get_multi(db, skip=skip, limit=limit)
    return staff_members

@router.post("/", response_model=staff_schema.Staff)
def create_staff(
    *,
    db: Session = Depends(deps.get_db),
    staff_in: staff_schema.StaffCreate,
) -> Any:
    """
    Create new staff member.
    """
    if staff_in.legacy_id and staff_in.legacy_id.strip():
        existing = crud_staff.staff.get_by_legacy_id(db, legacy_id=staff_in.legacy_id)
        if existing:
            raise HTTPException(
                status_code=400,
                detail="A staff member with this legacy ID already exists.",
            )
    try:
        staff_member = crud_staff.staff.create(db, obj_in=staff_in)
        return staff_member
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Database integrity error. Check if the legacy ID or User ID is already in use.",
        )

@router.put("/{id}", response_model=staff_schema.Staff)
def update_staff(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    staff_in: staff_schema.StaffUpdate,
) -> Any:
    """
    Update a staff member.
    """
    staff_member = crud_staff.staff.get(db, id=id)
    if not staff_member:
        raise HTTPException(status_code=404, detail="Staff member not found")
    staff_member = crud_staff.staff.update(db, db_obj=staff_member, obj_in=staff_in)
    return staff_member

@router.get("/{id}", response_model=staff_schema.Staff)
def read_staff_by_id(
    id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get staff member by ID.
    """
    staff_member = crud_staff.staff.get(db, id=id)
    if not staff_member:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return staff_member

@router.delete("/{id}", response_model=staff_schema.Staff)
def delete_staff(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Delete a staff member.
    """
    staff_member = crud_staff.staff.get(db, id=id)
    if not staff_member:
        raise HTTPException(status_code=404, detail="Staff member not found")
    staff_member = crud_staff.staff.remove(db, id=id)
    return staff_member
