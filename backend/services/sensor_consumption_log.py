# Importamos Modelo y Esquema de la Entidad
from models.sensor_consumption_log import ConsumptionSensorLog
from schemas.sensor_consumption_log import consumption_sensor_log_schema

# Importamos cliente DB
from config import db_client

# Metodo buscar un Log de un Sensor de Consumos
def search_consumption_sensor_log(field: str, key):

    try:
        sensor = db_client.sensors_consumption_log.find_one({field: key})
        return ConsumptionSensorLog(**consumption_sensor_log_schema(sensor))
    except:
        return {"error": "No se ha encontrado el registro del parámetro enviado al sensor"}