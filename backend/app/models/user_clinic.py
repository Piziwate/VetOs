from sqlalchemy import Column, Integer, ForeignKey, Table
from app.db.base_class import Base

user_clinic_association = Table(
    "user_clinic",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("user.id", ondelete="CASCADE"), primary_key=True),
    Column("clinic_id", Integer, ForeignKey("clinic.id", ondelete="CASCADE"), primary_key=True),
)
