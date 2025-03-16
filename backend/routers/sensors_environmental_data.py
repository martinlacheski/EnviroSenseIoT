from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.sensor_environmental_data import EnvironmentalSensorData

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
@router.get("/", response_model=List[EnvironmentalSensorData])
async def get_environmental_sensor_data(user: User = Depends(current_user)):
    data = await EnvironmentalSensorData.find().to_list()
    return data


# Ruta para obtener un Dato de Sensor Ambiental
@router.get("/{id}", response_model=EnvironmentalSensorData)
async def get_environmental_sensor_data(id: PydanticObjectId, user: User = Depends(current_user)):
    data = await EnvironmentalSensorData.get(id)
    if not data:
        raise HTTPException(status_code=404, detail="Dato de Sensor Ambiental no encontrado")
    return data


# Ruta para crear un Dato de Sensor Ambiental
@router.post("/", response_model=EnvironmentalSensorData, status_code=status.HTTP_201_CREATED)
async def create_environmental_sensor_data(sensor_data: EnvironmentalSensorData):
    # Insertar el nuevo dato de sensor ambiental
    await sensor_data.insert()
    return sensor_data
