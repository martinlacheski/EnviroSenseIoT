# Importamos Modelo y Esquema de la Entidad
from models.sensor_environmental_log import EnvironmentalSensorLog
from schemas.sensor_environmental_log import environmental_sensor_log_schema

# Importamos cliente DB
from config import db_client

# Metodo buscar un Log de un Sensor Ambiental
def search_environmental_sensor_log(field: str, key):

    try:
        sensor = db_client.sensors_environmental_log.find_one({field: key})
        return EnvironmentalSensorLog(**environmental_sensor_log_schema(sensor))
    except:
        return {"error": "No se ha encontrado el registro del parámetro enviado al sensor"}