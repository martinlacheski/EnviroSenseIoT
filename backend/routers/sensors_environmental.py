from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.sensor_environmental import EnvironmentalSensor
from schemas.sensor_environmental import environmental_sensor_schema, environmental_sensors_schema

# Importamos cliente DB
from config import db_client

# Importamos utilidades
from services.sensor_environmental import search_environmental_sensor

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/sensors/environmental",
    tags=["environmental sensors"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los Sensores ambientales
@router.get("/")
async def sensors(user: User = Depends(current_user)):
    return environmental_sensors_schema(db_client.sensors_environmental.find())


# Ruta para obtener un Sensor Ambiental
@router.get("/{id}")  # Path
async def sensor(id: str, current_user: User = Depends(current_user)):

    return search_environmental_sensor("_id", ObjectId(id))


# Ruta para crear un Sensor Ambiental
@router.post("/", response_model=EnvironmentalSensor, status_code=status.HTTP_201_CREATED)
async def sensor(sensor: EnvironmentalSensor, current_user: User = Depends(current_user)):

    if type(search_environmental_sensor("sensor_code", sensor.sensor_code)) == EnvironmentalSensor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ya existe un sensor ambiental con ese código",
        )

    sensor_dict = dict(sensor)
    del sensor_dict["id"]

    # Crear el Sensor Ambiental en la BD y obtener el ID
    id = db_client.sensors_environmental.insert_one(sensor_dict).inserted_id
    
    # Buscar el Sensor creado y devolverlo
    new_sensor = environmental_sensor_schema(db_client.sensors_environmental.find_one({"_id": id}))

    return EnvironmentalSensor(**new_sensor)


# Ruta para actualizar un Sensor Ambiental
@router.put("/", response_model=EnvironmentalSensor)
async def sensor(sensor: EnvironmentalSensor, current_user: User = Depends(current_user)):

    sensor_dict = dict(sensor)
    del sensor_dict["id"]

    try:
        db_client.sensors_environmental.find_one_and_replace({"_id": ObjectId(sensor.id)}, sensor_dict)
    except:
        return {"error": "No se ha actualizado el sensor ambiental"}

    return search_environmental_sensor("_id", ObjectId(sensor.id))


# Ruta para eliminar un Sensor Ambiental
@router.delete("/{id}")
async def sensor(id: str, current_user: User = Depends(current_user)):

    found = db_client.sensors_environmental.find_one_and_delete({"_id": ObjectId(id)})
    if found == None:
        return {"error": "No se ha encontrado el sensor ambiental"}
    else:
        return {"mensaje": "Sensor ambiental eliminado"}
