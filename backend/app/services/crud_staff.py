from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.staff import Staff
from app.schemas.staff import StaffCreate, StaffUpdate

class CRUDStaff:
    def get(self, db: Session, id: int) -> Optional[Staff]:
        return db.query(Staff).filter(Staff.id == id).first()

    def get_by_legacy_id(self, db: Session, legacy_id: str) -> Optional[Staff]:
        return db.query(Staff).filter(Staff.legacy_id == legacy_id).first()

    def get_multi(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[Staff]:
        return db.query(Staff).offset(skip).limit(limit).all()

    def _clean_data(self, data: dict) -> dict:
        """Convert empty strings to None for optional fields."""
        return {k: (None if v == "" else v) for k, v in data.items()}

    def create(self, db: Session, *, obj_in: StaffCreate) -> Staff:
        data = self._clean_data(obj_in.model_dump())
        db_obj = Staff(**data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: Staff, obj_in: StaffUpdate) -> Staff:
        update_data = self._clean_data(obj_in.model_dump(exclude_unset=True))
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: int) -> Optional[Staff]:
        obj = db.query(Staff).filter(Staff.id == id).first()
        if obj:
            db.delete(obj)
            db.commit()
        return obj

staff = CRUDStaff()
