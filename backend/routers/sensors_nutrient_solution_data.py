from fastapi import APIRouter, Depends, status
from bson import ObjectId

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.sensor_nutrient_solution_data import SensorNutrientSolutionData
from schemas.sensor_nutrient_solution_data import (
    sensor_nutrient_solution_data_schema,
    sensors_nutrient_solution_data_schema,
)

# Importamos cliente DB
from config import db_client

# Importamos utilidades
from services.sensor_nutrient_solution_data import search_sensor_nutrient_solution_data

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/sensors/nutrients/solution/data",
    tags=[
        "nutrient solution sensors data"
    ],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los datos de Sensores de Solucion de Nutrientes
@router.get("/")
async def data(user: User = Depends(current_user)):
    return sensors_nutrient_solution_data_schema(
        db_client.sensors_nutrient_solution_data.find()
    )


# Ruta para obtener un Dato de Sensor de Solucion de Nutrientes
@router.get("/{id}")  # Path
async def data(id: str, current_user: User = Depends(current_user)):

    return search_sensor_nutrient_solution_data("_id", ObjectId(id))


# Ruta para crear un Dato de Sensor de Solucion de Nutrientes
@router.post(
    "/", response_model=SensorNutrientSolutionData, status_code=status.HTTP_201_CREATED
)
async def data(sensor_data: SensorNutrientSolutionData):

    data_dict = dict(sensor_data)
    del data_dict["id"]

    # Crear el Dato del Sensor de Solucion de Nutrientes en la BD y obtener el ID
    id = db_client.sensors_nutrient_solution_data.insert_one(data_dict).inserted_id

    # Buscar el dato creado y devolverlo
    new_data = sensor_nutrient_solution_data_schema(
        db_client.sensors_nutrient_solution_data.find_one({"_id": id})
    )

    return SensorNutrientSolutionData(**new_data)
