# Importamos Modelo y Esquema de la Entidad
from models.actuator_data import ActuatorData
from schemas.actuator_data import actuator_data_schema

# Importamos cliente DB
from config import db_client

# Metodo buscar un Actuador
def search_actuator_data(field: str, key):

    try:
        actuator_data = db_client.actuators_data.find_one({field: key})
        return ActuatorData(**actuator_data_schema(actuator_data))
    except:
        return {"error": "No se ha encontrado el dato del actuador"}