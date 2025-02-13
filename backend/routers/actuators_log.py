from fastapi import APIRouter, Depends, status
from bson import ObjectId

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.actuator_log import ActuatorLog
from schemas.actuator_log import actuator_log_schema, actuators_log_schema

# Importamos cliente DB
from config import db_client

# Importamos utilidades
from services.actuators_log import search_actuator_log

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/actuators/log",
    tags=["actuators log"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los logs de Actuadores
@router.get("/")
async def actuators_log(user: User = Depends(current_user)):
    
    return actuators_log_schema(db_client.actuators_log.find())


# Ruta para obtener un log de un Actuador
@router.get("/{id}")  # Path
async def actuator_log(id: str, current_user: User = Depends(current_user)):

    return search_actuator_log("_id", ObjectId(id))


# Ruta para crear un Log de un Actuador
@router.post("/", response_model=ActuatorLog, status_code=status.HTTP_201_CREATED)
async def actuator_log(actuator_log: ActuatorLog, current_user: User = Depends(current_user)):

    actuator_log_dict = dict(actuator_log)
    
    # Agregamos el Usuario actual que realiza la operación
    actuator_log_dict["user_id"] = current_user.id

    # Crear el Log del Actuador en la BD y obtener el ID
    id = db_client.actuators_log.insert_one(actuator_log_dict).inserted_id

    # Buscar el Log del Actuador creado y devolverlo
    new_actuator_log = actuator_log_schema(db_client.actuators_log.find_one({"_id": id}))

    return ActuatorLog(**new_actuator_log)
