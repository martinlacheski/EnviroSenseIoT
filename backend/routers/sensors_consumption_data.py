from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.sensor_consumption_data import ConsumptionSensorData


# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/sensors/consumption/data",
    tags=["consumption sensors data"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)

# Ruta para obtener todos los datos de sensores de consumo
@router.get("/", response_model=List[ConsumptionSensorData])
async def get_sensor_consumption_data(user: User = Depends(current_user)):
    return await ConsumptionSensorData.find().to_list()


# Ruta para obtener un Dato de Sensor de consumos
@router.get("/{id}", response_model=ConsumptionSensorData)
async def get_sensor_consumption_data(id: PydanticObjectId, user: User = Depends(current_user)):
    data = await ConsumptionSensorData.get(id)
    if not data:
        raise HTTPException(status_code=404, detail="Dato de sensor de consumos no encontrado")
    return data


# Ruta para crear un Dato de Sensor de consumos
@router.post("/", response_model=ConsumptionSensorData, status_code=status.HTTP_201_CREATED)
async def create_sensor_consumption_data(sensor_data: ConsumptionSensorData):
    await sensor_data.insert()
    return sensor_data
