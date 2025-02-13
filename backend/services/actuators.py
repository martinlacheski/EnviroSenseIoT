# Importamos Modelo y Esquema de la Entidad
from models.actuator import Actuator
from schemas.actuator import actuator_schema

# Importamos cliente DB
from config import db_client

# Metodo buscar un Actuador
def search_actuator(field: str, key):

    try:
        actuator = db_client.actuators.find_one({field: key})
        return Actuator(**actuator_schema(actuator))
    except:
        return {"error": "No se ha encontrado el actuador"}