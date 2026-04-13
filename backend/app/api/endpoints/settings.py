from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from app.api import deps
from app.services import crud_setting

router = APIRouter()

class SettingUpdate(BaseModel):
    key: str
    value: Any

@router.get("/")
async def get_settings(db: AsyncSession = Depends(deps.get_db)):
    return await crud_setting.get_all_settings(db)

@router.put("/")
async def update_setting(payload: SettingUpdate, db: AsyncSession = Depends(deps.get_db)):
    return await crud_setting.update_setting(db, payload.key, payload.value)
