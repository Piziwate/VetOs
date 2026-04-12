from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_user
from app.services.crud_user import user as crud_user
from app.schemas.user_token import User, UserCreate
from app.models.user import User as UserModel

router = APIRouter()

@router.get("/me", response_model=User)
async def read_user_me(
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    """Get current user."""
    return current_user

@router.post("/", response_model=User)
async def create_user(
    *,
    db: AsyncSession = Depends(get_db),
    user_in: UserCreate,
    # TODO: Add superuser check here
) -> Any:
    """Create new user."""
    user = await crud_user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    return await crud_user.create(db, obj_in=user_in)
