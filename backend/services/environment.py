# Importamos Modelo y Esquema de la Entidad
from models.environment import Environment
from schemas.environment import environment_schema

# Importamos cliente DB
from config import db_client

# Metodo buscar un Ambiente
def search_environment(field: str, key):

    try:
        environment = db_client.environments.find_one({field: key})
        return Environment(**environment_schema(environment))
    except:
        return {"error": "No se ha encontrado el ambiente"}