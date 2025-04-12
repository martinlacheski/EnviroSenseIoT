from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

# Importamos Modelo y Esquema de la Entidad
from models.sensor_environmental_log import EnvironmentalSensorLog
from models.user import User
from models.sensor_environmental import EnvironmentalSensor

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/sensors/environmental",
    tags=["environmental sensors"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los Sensores ambientales
@router.get("/", response_model=List[EnvironmentalSensor])
async def get_environmental_sensors(user: User = Depends(current_user)):
    sensors = await EnvironmentalSensor.find(fetch_links=True).to_list()
    return sensors


# Ruta para obtener un Sensor Ambiental
@router.get("/{id}", response_model=EnvironmentalSensor)
async def get_environmental_sensor(id: PydanticObjectId, user: User = Depends(current_user)):
    sensor = await EnvironmentalSensor.get(id, fetch_links=True)
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor ambiental no encontrado")
    return sensor


# Ruta para crear un Sensor Ambiental
@router.post("/", response_model=EnvironmentalSensor, status_code=status.HTTP_201_CREATED)
async def create_environmental_sensor(sensor: EnvironmentalSensor, user: User = Depends(current_user)):
    # Validar si ya existe un sensor con el mismo código
    existing_sensor = await EnvironmentalSensor.find_one({"sensor_code": sensor.sensor_code})
    if existing_sensor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un sensor ambiental con ese código"
        )

    # Insertar el nuevo sensor
    await sensor.insert()
    
    # Crear el log de la operación
    log = EnvironmentalSensorLog(
        environment=sensor.environment,
        description=sensor.description,
        sensor_code=sensor.sensor_code,
        temperature_alert=sensor.temperature_alert,
        humidity_alert=sensor.humidity_alert,
        atmospheric_pressure_alert=sensor.atmospheric_pressure_alert,
        co2_alert=sensor.co2_alert,
        seconds_to_report=sensor.seconds_to_report,
        enabled=sensor.enabled,
        user=user,
        operation="create"
    )
    await log.insert()
    
    return sensor


# Ruta para actualizar un Sensor Ambiental
@router.put("/", response_model=EnvironmentalSensor)
async def update_environmental_sensor(sensor: EnvironmentalSensor, user: User = Depends(current_user)):
    # Verificar si el ID está presente
    if sensor.id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El ID del sensor es requerido para actualizar"
        )

    # Buscar el sensor existente
    existing_sensor = await EnvironmentalSensor.get(sensor.id)
    if not existing_sensor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sensor ambiental no encontrado"
        )

    # Verificar si ya existe otro sensor con el mismo código (excluyendo el actual)
    duplicate = await EnvironmentalSensor.find_one(
        {"sensor_code": sensor.sensor_code, "_id": {"$ne": sensor.id}}
    )
    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un sensor ambiental con ese código"
        )

    # Actualizar el sensor
    await sensor.replace()
    
    # Crear el log de la operación
    log = EnvironmentalSensorLog(
        environment=sensor.environment,
        description=sensor.description,
        sensor_code=sensor.sensor_code,
        temperature_alert=sensor.temperature_alert,
        humidity_alert=sensor.humidity_alert,
        atmospheric_pressure_alert=sensor.atmospheric_pressure_alert,
        co2_alert=sensor.co2_alert,
        seconds_to_report=sensor.seconds_to_report,
        enabled=sensor.enabled,
        user=user,
        operation="update"
    )
    await log.insert()
    
    return sensor


# Ruta para eliminar un Sensor Ambiental
@router.delete("/{id}")
async def delete_environmental_sensor(id: PydanticObjectId, user: User = Depends(current_user)):
    # Buscar el sensor
    sensor = await EnvironmentalSensor.get(id)
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor ambiental no encontrado")
    
    # Crear el log de la operación antes de eliminar el sensor
    log = EnvironmentalSensorLog(
        environment=sensor.environment,
        description=sensor.description,
        sensor_code=sensor.sensor_code,
        temperature_alert=sensor.temperature_alert,
        humidity_alert=sensor.humidity_alert,
        atmospheric_pressure_alert=sensor.atmospheric_pressure_alert,
        co2_alert=sensor.co2_alert,
        seconds_to_report=sensor.seconds_to_report,
        enabled=sensor.enabled,
        user=user,
        operation="delete"
    )
    await log.insert()

    # Eliminar el sensor
    await sensor.delete()
    return {"message": "Sensor ambiental eliminado correctamente"}