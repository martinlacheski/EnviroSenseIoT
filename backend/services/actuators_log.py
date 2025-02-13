# Importamos Modelo y Esquema de la Entidad
from models.actuator_log import ActuatorLog
from schemas.actuator_log import actuator_log_schema

# Importamos cliente DB
from config import db_client

# Metodo buscar un Log de un Actuador
def search_actuator_log(field: str, key):

    try:
        actuator = db_client.actuators_log.find_one({field: key})
        return ActuatorLog(**actuator_log_schema(actuator))
    except:
        return {"error": "No se ha encontrado el registro del parámetro enviado al actuador"}