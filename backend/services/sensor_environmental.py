# Importamos Modelo y Esquema de la Entidad
from models.sensor_environmental import EnvironmentalSensor
from schemas.sensor_environmental import environmental_sensor_schema

# Importamos cliente DB
from config import db_client

# Metodo buscar un Sensor Ambiental
def search_environmental_sensor(field: str, key):

    try:
        sensor = db_client.sensors_environmental.find_one({field: key})
        return EnvironmentalSensor(**environmental_sensor_schema(sensor))
    except:
        return {"error": "No se ha encontrado el sensor ambiental"}