# Importamos Modelo y Esquema de la Entidad
from models.city import City
from schemas.city import city_schema

# Importamos cliente DB
from config import db_client

# Metodo buscar una Ciudad
def search_city(field: str, key):

    try:
        city = db_client.cities.find_one({field: key})
        return City(**city_schema(city))
    except:
        return {"error": "No se ha encontrado la ciudad"}