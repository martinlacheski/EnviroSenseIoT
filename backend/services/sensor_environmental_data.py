# Importamos Modelo y Esquema de la Entidad
from models.sensor_environmental_data import SensorEnvironmentalData
from schemas.sensor_environmental_data import sensor_environmental_data_schema

# Importamos cliente DB
from config import db_client

# Metodo buscar un dato de un Sensor Ambiental
def search_sensor_environmental_data(field: str, key):

    try:
        sensor = db_client.sensors_environmental_data.find_one({field: key})
        return SensorEnvironmentalData(**sensor_environmental_data_schema(sensor))
    except:
        return {"error": "No se ha encontrado el dato del sensor ambiental"}