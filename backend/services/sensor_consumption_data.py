# Importamos Modelo y Esquema de la Entidad
from models.sensor_consumption_data import SensorConsumptionData
from schemas.sensor_consumption_data import sensor_consumption_data_schema

# Importamos cliente DB
from config import db_client

# Metodo buscar un dato de un Sensor de Consumos
def search_sensor_consumption_data(field: str, key):
    
    try:
        sensor = db_client.sensors_consumption_data.find_one({field: key})
        
        return SensorConsumptionData(**sensor_consumption_data_schema(sensor))
    except:
        return {"error": "No se ha encontrado el dato del sensor de consumos"}