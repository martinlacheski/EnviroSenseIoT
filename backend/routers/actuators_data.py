from fastapi import APIRouter, Depends, status
from bson import ObjectId

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.actuator_data import ActuatorData
from schemas.actuator_data import (
    actuator_data_schema,
    actuators_data_schema,
)

# Importamos cliente DB
from config import db_client

# Importamos utilidades
from services.actuators_data import search_actuator_data

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/actuators/data",
    tags=["actuators data"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los datos de los actuadores
@router.get("/")
async def data(user: User = Depends(current_user)):

    return actuators_data_schema(db_client.actuators_data.find())


# Ruta para obtener un Dato de un Actuador
@router.get("/{id}")  # Path
async def data(id: str, current_user: User = Depends(current_user)):

    return search_actuator_data("_id", ObjectId(id))


# Ruta para crear un Dato de un Actuador
@router.post("/", response_model=ActuatorData, status_code=status.HTTP_201_CREATED)
async def data(actuator_data: ActuatorData):

    data_dict = dict(actuator_data)
    del data_dict["id"]

    # Crear el Dato del Actuador en la BD y obtener el ID
    id = db_client.actuators_data.insert_one(data_dict).inserted_id

    # Buscar el dato creado y devolverlo
    new_data = actuator_data_schema(db_client.actuators_data.find_one({"_id": id}))

    return ActuatorData(**new_data)
