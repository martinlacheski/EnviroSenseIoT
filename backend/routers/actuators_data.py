from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.actuator_data import ActuatorData

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/actuators/data",
    tags=["actuators data"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los datos de los actuadores
@router.get("/", response_model=List[ActuatorData])
async def get_actuator_data(user: User = Depends(current_user)):
    return await ActuatorData.find().to_list()


# Ruta para obtener un Dato de un Actuador
@router.get("/{id}", response_model=ActuatorData)
async def get_actuator_data(id: PydanticObjectId, user: User = Depends(current_user)):
    data = await ActuatorData.get(id)
    if not data:
        raise HTTPException(status_code=404, detail="Dato de actuador no encontrado")
    return data


# Ruta para crear un Dato de un Actuador
@router.post("/", response_model=ActuatorData, status_code=status.HTTP_201_CREATED)
async def create_actuator_data(actuator_data: ActuatorData):
    await actuator_data.insert()
    return actuator_data
