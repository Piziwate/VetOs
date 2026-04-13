import asyncio
import logging
from app.db import base  # noqa: F401 - Import all models for SQLAlchemy
from app.db.session import AsyncSessionLocal
from app.services.crud_user import user as crud_user
from app.schemas.user_token import UserCreate
from app.models.user import UserRole

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def init_db() -> None:
    async with AsyncSessionLocal() as db:
        # 1. Ensure Admin User exists
        user = await crud_user.get_by_email(db, email="admin@vetos.ch")
        if not user:
            user_in = UserCreate(
                email="admin@vetos.ch",
                password="adminpassword",  # CHANGE THIS IMMEDIATELY
                full_name="System Admin",
                role=UserRole.TECHNICAL,
                is_active=True,
            )
            await crud_user.create(db, obj_in=user_in)
            logger.info("Initial technical admin user created: admin@vetos.ch")
        else:
            logger.info("Admin user already exists.")

if __name__ == "__main__":
    asyncio.run(init_db())
