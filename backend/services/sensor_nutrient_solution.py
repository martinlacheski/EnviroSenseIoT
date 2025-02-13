# Importamos Modelo y Esquema de la Entidad
from models.sensor_nutrient_solution import NutrientSolutionSensor
from schemas.sensor_nutrient_solution import nutrient_solution_sensor_schema

# Importamos cliente DB
from config import db_client

# Metodo buscar un Sensor Ambiental
def search_nutrient_solution_sensor(field: str, key):

    try:
        sensor = db_client.sensors_nutrient_solution.find_one({field: key})
        return NutrientSolutionSensor(**nutrient_solution_sensor_schema(sensor))
    except:
        return {"error": "No se ha encontrado el sensor de solución nutritiva"}