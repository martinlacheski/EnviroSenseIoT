# Importamos Modelo y Esquema de la Entidad
from models.sensor_nutrient_solution_data import SensorNutrientSolutionData
from schemas.sensor_nutrient_solution_data import sensor_nutrient_solution_data_schema

# Importamos cliente DB
from config import db_client

# Metodo buscar un dato de un Sensor de Solución nutritiva
def search_sensor_nutrient_solution_data(field: str, key):

    try:
        sensor = db_client.sensors_nutrient_solution_data.find_one({field: key})
        return SensorNutrientSolutionData(**sensor_nutrient_solution_data_schema(sensor))
    except:
        return {"error": "No se ha encontrado el dato del sensor de solución nutritiva"}