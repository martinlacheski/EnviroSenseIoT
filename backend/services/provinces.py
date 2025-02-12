# Importamos Modelo y Esquema de la Entidad
from models.province import Province
from schemas.province import province_schema

# Importamos cliente DB
from config import db_client

# Metodo buscar una Provincia
def search_province(field: str, key):

    try:
        province = db_client.provinces.find_one({field: key})
        return Province(**province_schema(province))
    except:
        return {"error": "No se ha encontrado la provincia"}