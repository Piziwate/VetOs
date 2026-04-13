from typing import Any, Dict, List
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.setting import Setting

DEFAULT_SETTINGS = {
    # OPERATIONAL -> Company
    "company_name": {"value": "", "category": "operational", "sub_category": "Société", "description": "Raison sociale (Société gérante)"},
    "company_vat_number": {"value": "", "category": "operational", "sub_category": "Société", "description": "Numéro de TVA (ex: CHE-123.456.789 TVA)"},
    "company_address": {"value": "", "category": "operational", "sub_category": "Société", "description": "Siège social / Adresse de facturation"},
    "company_website": {"value": "", "category": "operational", "sub_category": "Société", "description": "Site internet global du groupe"},
    "company_email": {"value": "", "category": "operational", "sub_category": "Société", "description": "Email administratif / Support"},

    # TECHNICAL -> Legacy Import
    "mssql_host": {"value": "127.0.0.1", "category": "technical", "sub_category": "Legacy Import", "description": "IP ou Hostname du serveur MSSQL Legacy"},
    "mssql_port": {"value": "1433", "category": "technical", "sub_category": "Legacy Import", "description": "Port MSSQL (défaut: 1433)"},
    "mssql_db": {"value": "", "category": "technical", "sub_category": "Legacy Import", "description": "Nom de la base de données source (ex: Diana)"},
    "mssql_user": {"value": "", "category": "technical", "sub_category": "Legacy Import", "description": "Utilisateur MSSQL"},
    "mssql_password": {"value": "", "category": "technical", "sub_category": "Legacy Import", "description": "Mot de passe MSSQL"},
}

async def get_all_settings(db: AsyncSession) -> List[Dict[str, Any]]:
    result = await db.execute(select(Setting))
    db_settings = {s.key: s.value for s in result.scalars().all()}
    
    final_settings = []
    for key, defaults in DEFAULT_SETTINGS.items():
        # On utilise toujours la structure définie dans DEFAULT_SETTINGS
        # Mais on injecte la valeur de la DB si elle existe
        current_value = db_settings.get(key, defaults["value"])
        
        final_settings.append({
            "key": key,
            "value": current_value,
            "category": defaults["category"],
            "sub_category": defaults["sub_category"],
            "description": defaults["description"]
        })
    return final_settings

async def update_setting(db: AsyncSession, key: str, value: Any) -> Setting:
    result = await db.execute(select(Setting).filter(Setting.key == key))
    setting = result.scalars().first()
    
    defaults = DEFAULT_SETTINGS.get(key, {"category": "other", "sub_category": "Autres", "description": ""})
    
    if not setting:
        setting = Setting(
            key=key, 
            value=value, 
            category=defaults["category"],
            sub_category=defaults.get("sub_category"),
            description=defaults["description"]
        )
        db.add(setting)
    else:
        setting.value = value
        # On met à jour aussi les métadonnées au cas où elles auraient changé dans le code
        setting.category = defaults["category"]
        setting.sub_category = defaults.get("sub_category")
        setting.description = defaults["description"]
    
    await db.commit()
    await db.refresh(setting)
    return setting

async def get_setting_value(db: AsyncSession, key: str) -> Any:
    result = await db.execute(select(Setting).filter(Setting.key == key))
    setting = result.scalars().first()
    if setting:
        return setting.value
    return DEFAULT_SETTINGS.get(key, {}).get("value")
