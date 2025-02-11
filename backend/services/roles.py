# Importamos Modelo y Esquema de la Entidad
from models.role import Role
from schemas.role import role_schema

# Importamos cliente DB
from config import db_client

# Metodo buscar un usuario
def search_role(field: str, key):

    try:
        role = db_client.roles.find_one({field: key})
        return Role(**role_schema(role))
    except:
        return {"error": "No se ha encontrado el rol"}