from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.api.deps import get_db
from app.services.crud_client_patient import client as crud_client
from app.schemas.client_patient import Client, ClientCreate, ClientUpdate, ClientPagination, ClientWithPatients

router = APIRouter()

@router.get("/", response_model=ClientPagination)
async def read_clients(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None, description="Search clients by name, email, phone..."),
    sort_by: str = Query("last_name", description="Column to sort by"),
    sort_order: str = Query("asc", regex="^(asc|desc)$")
):
    """Retrieve all clients with pagination, search and sorting."""
    items, total = await crud_client.get_multi_paginated(
        db, 
        skip=skip, 
        limit=limit, 
        search=search, 
        sort_by=sort_by, 
        sort_order=sort_order
    )
    return {"items": items, "total": total}

@router.post("/", response_model=Client, status_code=status.HTTP_201_CREATED)
async def create_client(
    client_in: ClientCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new client."""
    return await crud_client.create(db, obj_in=client_in)

@router.get("/{client_id}", response_model=ClientWithPatients)
async def read_client(
    client_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific client by ID with their patients."""
    db_obj = await crud_client.get_with_patients(db, id=client_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_obj

@router.put("/{client_id}", response_model=Client)
async def update_client(
    client_id: int,
    client_in: ClientUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a client's information."""
    db_obj = await crud_client.get(db, id=client_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Client not found")
    return await crud_client.update(db, db_obj=db_obj, obj_in=client_in)
