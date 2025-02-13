from fastapi import APIRouter, Depends, status
from bson import ObjectId

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.sensor_environmental_data import SensorEnvironmentalData
from schemas.sensor_environmental_data import (
    sensor_environmental_data_schema,
    sensors_environmental_data_schema,
)

# Importamos cliente DB
from config import db_client

# Importamos utilidades
from services.sensor_environmental_data import search_sensor_environmental_data

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/sensors/environmental/data",
    tags=[
        "environmental sensors data"
    ],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los datos de Sensores Ambientales
@router.get("/")
async def data(user: User = Depends(current_user)):
    return sensors_environmental_data_schema(
        db_client.sensors_environmental_data.find()
    )


# Ruta para obtener un Dato de Sensor Ambiental
@router.get("/{id}")  # Path
async def data(id: str, current_user: User = Depends(current_user)):

    return search_sensor_environmental_data("_id", ObjectId(id))


# Ruta para crear un Dato de Sensor Ambiental
@router.post(
    "/", response_model=SensorEnvironmentalData, status_code=status.HTTP_201_CREATED
)
async def data(sensor_data: SensorEnvironmentalData):

    data_dict = dict(sensor_data)
    del data_dict["id"]

    # Crear el Dato del Sensor Ambiental en la BD y obtener el ID
    id = db_client.sensors_environmental_data.insert_one(data_dict).inserted_id

    # Buscar el dato creado y devolverlo
    new_data = sensor_environmental_data_schema(
        db_client.sensors_environmental_data.find_one({"_id": id})
    )

    return SensorEnvironmentalData(**new_data)
