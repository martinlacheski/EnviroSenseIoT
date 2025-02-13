from fastapi import APIRouter, Depends, status
from bson import ObjectId

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.sensor_consumption_log import ConsumptionSensorLog
from schemas.sensor_consumption_log import consumption_sensor_log_schema, consumption_sensors_log_schema

# Importamos cliente DB
from config import db_client

# Importamos utilidades
from services.sensor_consumption_log import search_consumption_sensor_log

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/sensors/consumption/log",
    tags=["consumption sensors log"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los logs de Sensores de Consumos
@router.get("/")
async def sensors_log(user: User = Depends(current_user)):
    
    return consumption_sensors_log_schema(db_client.sensors_consumption_log.find())


# Ruta para obtener un log de un Sensor de Consumo
@router.get("/{id}")  # Path
async def sensor_log(id: str, current_user: User = Depends(current_user)):

    return search_consumption_sensor_log("_id", ObjectId(id))


# Ruta para crear un Log de un Sensor de Consumo
@router.post("/", response_model = ConsumptionSensorLog, status_code=status.HTTP_201_CREATED)
async def sensor_log(sensor_log: ConsumptionSensorLog, current_user: User = Depends(current_user)):

    sensor_log_dict = dict(sensor_log)
    del sensor_log_dict["id"]
    
    # Agregamos el Usuario actual que realiza la operación
    sensor_log_dict["user_id"] = current_user.id

    # Crear el Log del Sensor en la BD y obtener el ID
    id = db_client.sensors_consumption_log.insert_one(sensor_log_dict).inserted_id

    # Buscar el Log del Sensor creado y devolverlo
    new_log = consumption_sensor_log_schema(db_client.sensors_consumption_log.find_one({"_id": id}))

    return ConsumptionSensorLog(**new_log)
