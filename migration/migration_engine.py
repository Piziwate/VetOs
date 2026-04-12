import asyncio
import logging
import os
import sys
from datetime import datetime
import pymssql
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from dotenv import load_dotenv

# Add backend directory to sys.path to import SQLAlchemy models
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.models.client import Client
from app.models.patient import Patient

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Legacy MSSQL Credentials
MSSQL_HOST = os.getenv("MSSQL_HOST", r"nvsrv01.nacvet.local\SQLEXPRESS")
MSSQL_USER = os.getenv("MSSQL_USER", "NvAnalyzer")
MSSQL_PASS = os.getenv("MSSQL_PASS", "Grub6-Outbid0-Distort9-Caravan5-Gift9")
MSSQL_DB = os.getenv("MSSQL_DB", "Diana")

# VetOS PostgreSQL Credentials
POSTGRES_URL = os.getenv("VETOS_POSTGRES_URL", "postgresql+asyncpg://vetos_user:vetos_password@localhost:5432/vetos_db")

class VetOSMigrationEngine:
    def __init__(self):
        self.pg_engine = create_async_engine(POSTGRES_URL, echo=False)
        self.pg_session = sessionmaker(self.pg_engine, class_=AsyncSession, expire_on_commit=False)
        self.mssql_conn = None

    def connect_mssql(self):
        try:
            logger.info(f"Connecting to Legacy MSSQL on {MSSQL_HOST}...")
            self.mssql_conn = pymssql.connect(MSSQL_HOST, MSSQL_USER, MSSQL_PASS, MSSQL_DB, as_dict=True)
            logger.info("Connected to Legacy MSSQL.")
            return True
        except Exception as e:
            logger.error(f"Failed to connect to MSSQL: {e}")
            return False

    async def migrate_clients(self):
        logger.info("Extracting clients from MSSQL (DiaAdrs)...")
        cursor = self.mssql_conn.cursor()
        # Filter out deleted or completely inactive rows if necessary.
        # Keeping it simple: import everyone with IsAktiv > -1, or just everyone for now
        # and map to the clean DDD PostgreSQL schema.
        cursor.execute("""
            SELECT 
                DiaId, NachName, VorName, Strasse, PLZ, Ort, 
                Tel1, Mobil1, Email, IsAktiv, Deleted 
            FROM DiaAdrs
            WHERE Deleted = 0
        """)
        
        legacy_clients = cursor.fetchall()
        logger.info(f"Found {len(legacy_clients)} active legacy clients.")
        
        async with self.pg_session() as session:
            imported_count = 0
            for row in legacy_clients:
                legacy_id = str(row['DiaId'])
                
                # Check if already imported
                result = await session.execute(select(Client).filter(Client.legacy_id == legacy_id))
                existing_client = result.scalars().first()
                
                if not existing_client:
                    new_client = Client(
                        legacy_id=legacy_id,
                        first_name=row.get('VorName') or "",
                        last_name=row.get('NachName') or "",
                        email=row.get('Email') or "",
                        phone=row.get('Mobil1') or row.get('Tel1') or "",
                        address=row.get('Strasse') or "",
                        city=row.get('Ort') or "",
                        zip_code=row.get('PLZ') or "",
                        is_active=(row.get('IsAktiv', 0) == -1) # -1 usually means True in some MS Access/legacy systems
                    )
                    session.add(new_client)
                    imported_count += 1
            
            if imported_count > 0:
                await session.commit()
                logger.info(f"Successfully migrated {imported_count} new clients to PostgreSQL.")
            else:
                logger.info("No new clients to migrate.")

    async def migrate_patients(self):
        logger.info("Extracting patients from MSSQL (DiaTiere)...")
        cursor = self.mssql_conn.cursor()
        cursor.execute("""
            SELECT 
                DiaId, AdrID, Name, TierArt, Rasse, Sex, GeburtsTag, IsAktiv, Deleted 
            FROM DiaTiere
            WHERE Deleted = 0
        """)
        
        legacy_patients = cursor.fetchall()
        logger.info(f"Found {len(legacy_patients)} active legacy patients.")
        
        async with self.pg_session() as session:
            imported_count = 0
            
            # Fetch all clients to map owner_id efficiently
            result = await session.execute(select(Client))
            all_clients = {client.legacy_id: client.id for client in result.scalars().all()}
            
            for row in legacy_patients:
                legacy_id = str(row['DiaId'])
                legacy_owner_id = str(row['AdrID'])
                
                owner_id = all_clients.get(legacy_owner_id)
                if not owner_id:
                    # Skip orphan animals for now
                    continue
                
                # Check if already imported
                result = await session.execute(select(Patient).filter(Patient.legacy_id == legacy_id))
                existing_patient = result.scalars().first()
                
                if not existing_patient:
                    # Parse dates carefully (MSSQL might return datetime)
                    dob = row.get('GeburtsTag')
                    if isinstance(dob, datetime):
                        dob = dob.date()
                        
                    new_patient = Patient(
                        legacy_id=legacy_id,
                        name=row.get('Name') or "Inconnu",
                        species=row.get('TierArt') or "",
                        breed=row.get('Rasse') or "",
                        gender=row.get('Sex') or "",
                        date_of_birth=dob,
                        owner_id=owner_id,
                        is_active=(row.get('IsAktiv', 0) == -1)
                    )
                    session.add(new_patient)
                    imported_count += 1
            
            if imported_count > 0:
                await session.commit()
                logger.info(f"Successfully migrated {imported_count} new patients to PostgreSQL.")
            else:
                logger.info("No new patients to migrate.")

    async def run(self):
        if not self.connect_mssql():
            return
        
        try:
            await self.migrate_clients()
            await self.migrate_patients()
            logger.info("Migration cycle completed successfully.")
        finally:
            if self.mssql_conn:
                self.mssql_conn.close()

async def main():
    engine = VetOSMigrationEngine()
    await engine.run()

if __name__ == "__main__":
    asyncio.run(main())
