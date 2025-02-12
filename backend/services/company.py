# Importamos Modelo y Esquema de la Entidad
from models.company import Company
from schemas.company import company_schema

# Importamos cliente DB
from config import db_client

# Metodo buscar una Empresa
def search_company(field: str, key):

    try:
        company = db_client.companies.find_one({field: key})
        return Company(**company_schema(company))
    except:
        return {"error": "No se ha encontrado la empresa"}