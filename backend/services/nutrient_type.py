# Importamos Modelo y Esquema de la Entidad
from models.nutrient_type import NutrientType
from schemas.nutrient_type import nutrient_type_schema

# Importamos cliente DB
from config import db_client

# Metodo buscar un Tipo de Nutriente
def search_nutrient_type(field: str, key):

    try:
        nutrient_type = db_client.nutrient_types.find_one({field: key})
        return NutrientType(**nutrient_type_schema(nutrient_type))
    except:
        return {"error": "No se ha encontrado el tipo de nutriente"}