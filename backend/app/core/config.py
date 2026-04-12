from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "VetOS"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("VETOS_SECRET_KEY", "DEVELOPMENT_SECRET_KEY_CHANGE_IN_PROD")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    POSTGRES_URL: str = os.getenv("VETOS_POSTGRES_URL", "postgresql+asyncpg://vetos_user:vetos_password@localhost:5432/vetos_db")

    class Config:
        case_sensitive = True

settings = Settings()
