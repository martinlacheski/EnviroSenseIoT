from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.sensor_consumption import ConsumptionSensor
from schemas.sensor_consumption import (
    consumption_sensor_schema,
    consumption_sensors_schema,
)

# Importamos cliente DB
from config import db_client

# Importamos utilidades
from services.sensor_consumption import search_consumption_sensor

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/sensors/consumption",
    tags=["consumption sensors"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los Sensores de consumos
@router.get("/")
async def sensors(user: User = Depends(current_user)):
    return consumption_sensors_schema(db_client.sensors_consumption.find())


# Ruta para obtener un Sensor de Consumos
@router.get("/{id}")  # Path
async def sensor(id: str, current_user: User = Depends(current_user)):

    return search_consumption_sensor("_id", ObjectId(id))


# Ruta para crear un Sensor de Consumos
@router.post(
    "/", response_model=ConsumptionSensor, status_code=status.HTTP_201_CREATED
    )
async def sensor(
    sensor: ConsumptionSensor, current_user: User = Depends(current_user)
):

    if (
        type(search_consumption_sensor("sensor_code", sensor.sensor_code))
        == ConsumptionSensor
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ya existe un sensor de consumos con ese código",
        )

    sensor_dict = dict(sensor)
    del sensor_dict["id"]

    # Crear el Sensor de Consumos en la BD y obtener el ID
    id = db_client.sensors_consumption.insert_one(sensor_dict).inserted_id

    # Buscar el Sensor creado y devolverlo
    new_sensor = consumption_sensor_schema(
        db_client.sensors_consumption.find_one({"_id": id})
    )

    return ConsumptionSensor(**new_sensor)


# Ruta para actualizar un Sensor de Consumos
@router.put("/", response_model=ConsumptionSensor)
async def sensor(
    sensor: ConsumptionSensor, current_user: User = Depends(current_user)
):
    # Verificar si ya existe un sensor ambiental con el mismo código (excluyendo el actual)
    existing_type = db_client.sensors_consumption.find_one(
        {"sensor_code": sensor.sensor_code, "_id": {"$ne": ObjectId(sensor.id)}}
    )
    if existing_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un sensor de consumos con ese código",
        )

    sensor_dict = dict(sensor)
    del sensor_dict["id"]

    try:
        db_client.sensors_consumption.find_one_and_replace(
            {"_id": ObjectId(sensor.id)}, sensor_dict
        )
    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se ha actualizado el sensor",
        )

    updated_sensor = search_consumption_sensor("_id", ObjectId(sensor.id))
    if not updated_sensor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontró el sensor de consumos actualizado",
        )

    return updated_sensor


# Ruta para eliminar un Sensor de Consumos
@router.delete("/{id}")
async def sensor(id: str, current_user: User = Depends(current_user)):

    found = db_client.sensors_consumption.find_one_and_delete({"_id": ObjectId(id)})
    if found == None:
        return {"error": "No se ha encontrado el sensor de consumos"}
    else:
        return {"mensaje": "Sensor de consumo eliminado"}
