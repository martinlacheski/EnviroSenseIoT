# Importamos Modelo y Esquema de la Entidad
from models.environment_type import EnvironmentType
from schemas.environment_type import environment_type_schema

# Importamos cliente DB
from config import db_client

# Metodo buscar un Tipo de Ambiente
def search_environment_type(field: str, key):

    try:
        environment_type = db_client.environment_types.find_one({field: key})
        return EnvironmentType(**environment_type_schema(environment_type))
    except:
        return {"error": "No se ha encontrado el tipo de ambiente"}