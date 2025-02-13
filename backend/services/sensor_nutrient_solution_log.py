# Importamos Modelo y Esquema de la Entidad
from models.sensor_nutrient_solution_log import NutrientSolutionSensorLog
from schemas.sensor_nutrient_solution_log import nutrient_solution_sensor_log_schema

# Importamos cliente DB
from config import db_client

# Metodo buscar un Sensor Ambiental
def search_nutrient_solution_sensor_log(field: str, key):

    try:
        sensor = db_client.sensors_nutrient_solution_log.find_one({field: key})
        return NutrientSolutionSensorLog(**nutrient_solution_sensor_log_schema(sensor))
    except:
        return {"error": "No se ha encontrado el registro del parámetro enviado al sensor"}