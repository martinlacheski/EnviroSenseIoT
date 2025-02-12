# Importamos Modelo y Esquema de la Entidad
from models.country import Country
from schemas.country import country_schema

# Importamos cliente DB
from config import db_client

# Metodo buscar un País
def search_country(field: str, key):

    try:
        country = db_client.countries.find_one({field: key})
        return Country(**country_schema(country))
    except:
        return {"error": "No se ha encontrado el país"}