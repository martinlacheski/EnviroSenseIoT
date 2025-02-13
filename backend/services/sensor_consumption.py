# Importamos Modelo y Esquema de la Entidad
from models.sensor_consumption import ConsumptionSensor
from schemas.sensor_consumption import consumption_sensor_schema

# Importamos cliente DB
from config import db_client

# Metodo buscar un Sensor de Consumos
def search_consumption_sensor(field: str, key):

    try:
        sensor = db_client.sensors_consumption.find_one({field: key})
        return ConsumptionSensor(**consumption_sensor_schema(sensor))
    except:
        return {"error": "No se ha encontrado el sensor de consumos"}