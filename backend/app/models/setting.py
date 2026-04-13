from sqlalchemy import Column, String, JSON
from app.db.base_class import Base

class Setting(Base):
    __tablename__ = "setting"

    key = Column(String, primary_key=True, index=True)
    value = Column(JSON, nullable=False)
    category = Column(String, index=True)  # 'operational' or 'technical'
    sub_category = Column(String, index=True, nullable=True)
    description = Column(String, nullable=True)
