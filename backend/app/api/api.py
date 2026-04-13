from fastapi import APIRouter
from app.api.endpoints import login, users, clients, patients, settings, resources, staff

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(clients.router, prefix="/clients", tags=["clients"])
api_router.include_router(patients.router, prefix="/patients", tags=["patients"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
api_router.include_router(resources.router, prefix="/resources", tags=["resources"])
api_router.include_router(staff.router, prefix="/staff", tags=["staff"])
