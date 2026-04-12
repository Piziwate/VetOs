from fastapi import APIRouter
from app.api.endpoints import clients, patients

api_router = APIRouter()
api_router.include_router(clients.router, prefix="/clients", tags=["clients"])
api_router.include_router(patients.router, prefix="/patients", tags=["patients"])
