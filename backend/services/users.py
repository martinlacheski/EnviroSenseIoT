# Importamos Modelo y Esquema de la Entidad
from models.user import User
from schemas.user import user_schema

# Importamos cliente DB
from config import db_client

# Metodo buscar un usuario
def search_user(field: str, key):

    try:
        user = db_client.users.find_one({field: key})
        return User(**user_schema(user))
    except:
        return {"error": "No se ha encontrado el usuario"}