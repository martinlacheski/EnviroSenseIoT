from typing import List
from beanie import Link, PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status

# Importamos Modelo y Esquema de la Entidad
from models.sensor_consumption_log import ConsumptionSensorLog
from models.user import User
from models.sensor_consumption import ConsumptionSensor

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/sensors/consumption",
    tags=["consumption sensors"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los Sensores de consumos
@router.get("/", response_model=List[ConsumptionSensor])
async def get_consumption_sensors(user: User = Depends(current_user)):
    return await ConsumptionSensor.find(fetch_links=True).to_list()


# Ruta para obtener un Sensor de Consumos
@router.get("/{id}", response_model=ConsumptionSensor)
async def get_consumption_sensor(id: PydanticObjectId, user: User = Depends(current_user)):
    sensor = await ConsumptionSensor.get(id, fetch_links=True)
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor de consumos no encontrado")
    return sensor


# Ruta para crear un Sensor de Consumos
@router.post("/", response_model=ConsumptionSensor, status_code=status.HTTP_201_CREATED)
async def create_consumption_sensor(sensor: ConsumptionSensor, user: User = Depends(current_user)):
    # Validar si ya existe un sensor con el mismo código
    existing_sensor = await ConsumptionSensor.find_one({"sensor_code": sensor.sensor_code})
    if existing_sensor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un sensor de consumos con ese código"
        )

    # Insertar el nuevo sensor
    await sensor.insert()
    
    # Crear el log de la operación
    log = ConsumptionSensorLog(
        environment=sensor.environment,
        description=sensor.description,
        sensor_code=sensor.sensor_code,
        min_voltage_alert=sensor.min_voltage_alert,
        max_voltage_alert=sensor.max_voltage_alert,
        nutrient_1_enabled=sensor.nutrient_1_enabled,
        nutrient_1_type=sensor.nutrient_1_type,
        nutrient_1_alert=sensor.nutrient_1_alert,
        nutrient_2_enabled=sensor.nutrient_2_enabled,
        nutrient_2_type=sensor.nutrient_2_type,
        nutrient_2_alert=sensor.nutrient_2_alert,
        nutrient_3_enabled=sensor.nutrient_3_enabled,
        nutrient_3_type=sensor.nutrient_3_type,
        nutrient_3_alert=sensor.nutrient_3_alert,
        nutrient_4_enabled=sensor.nutrient_4_enabled,
        nutrient_4_type=sensor.nutrient_4_type,
        nutrient_4_alert=sensor.nutrient_4_alert,
        nutrient_5_enabled=sensor.nutrient_5_enabled,
        nutrient_5_type=sensor.nutrient_5_type,
        nutrient_5_alert=sensor.nutrient_5_alert,
        nutrient_6_enabled=sensor.nutrient_6_enabled,
        nutrient_6_type=sensor.nutrient_6_type,
        nutrient_6_alert=sensor.nutrient_6_alert,
        seconds_to_report=sensor.seconds_to_report,
        enabled=sensor.enabled,
        user=user,
        operation="create"
    )
    await log.insert()
    
    return sensor


# Ruta para actualizar un Sensor de Consumos
@router.put("/", response_model=ConsumptionSensor)
async def update_consumption_sensor(sensor: ConsumptionSensor, user: User = Depends(current_user)):
    # Verificar si el ID está presente
    if sensor.id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El ID del sensor es requerido para actualizar"
        )

    # Buscar el sensor existente
    existing_sensor = await ConsumptionSensor.get(sensor.id)
    if not existing_sensor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sensor de consumos no encontrado"
        )

    # Verificar si ya existe otro sensor con el mismo código (excluyendo el actual)
    duplicate = await ConsumptionSensor.find_one(
        {"sensor_code": sensor.sensor_code, "_id": {"$ne": sensor.id}}
    )
    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un sensor de consumos con ese código"
        )

    # Actualizar el sensor
    await sensor.replace()
    
    # Crear el log de la operación
    log = ConsumptionSensorLog(
        environment=sensor.environment,
        description=sensor.description,
        sensor_code=sensor.sensor_code,
        min_voltage_alert=sensor.min_voltage_alert,
        max_voltage_alert=sensor.max_voltage_alert,
        nutrient_1_enabled=sensor.nutrient_1_enabled,
        nutrient_1_type=sensor.nutrient_1_type,
        nutrient_1_alert=sensor.nutrient_1_alert,
        nutrient_2_enabled=sensor.nutrient_2_enabled,
        nutrient_2_type=sensor.nutrient_2_type,
        nutrient_2_alert=sensor.nutrient_2_alert,
        nutrient_3_enabled=sensor.nutrient_3_enabled,
        nutrient_3_type=sensor.nutrient_3_type,
        nutrient_3_alert=sensor.nutrient_3_alert,
        nutrient_4_enabled=sensor.nutrient_4_enabled,
        nutrient_4_type=sensor.nutrient_4_type,
        nutrient_4_alert=sensor.nutrient_4_alert,
        nutrient_5_enabled=sensor.nutrient_5_enabled,
        nutrient_5_type=sensor.nutrient_5_type,
        nutrient_5_alert=sensor.nutrient_5_alert,
        nutrient_6_enabled=sensor.nutrient_6_enabled,
        nutrient_6_type=sensor.nutrient_6_type,
        nutrient_6_alert=sensor.nutrient_6_alert,
        seconds_to_report=sensor.seconds_to_report,
        enabled=sensor.enabled,
        user=user,
        operation="update"
    )
    await log.insert()
    
    return sensor


# Ruta para eliminar un Sensor de Consumos
@router.delete("/{id}")
async def delete_consumption_sensor(id: PydanticObjectId, user: User = Depends(current_user)):
    # Buscar el sensor
    sensor = await ConsumptionSensor.get(id)
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor de consumos no encontrado")
    
    # Crear el log de la operación
    log = ConsumptionSensorLog(
        environment=sensor.environment,
        description=sensor.description,
        sensor_code=sensor.sensor_code,
        min_voltage_alert=sensor.min_voltage_alert,
        max_voltage_alert=sensor.max_voltage_alert,
        nutrient_1_enabled=sensor.nutrient_1_enabled,
        nutrient_1_type=sensor.nutrient_1_type,
        nutrient_1_alert=sensor.nutrient_1_alert,
        nutrient_2_enabled=sensor.nutrient_2_enabled,
        nutrient_2_type=sensor.nutrient_2_type,
        nutrient_2_alert=sensor.nutrient_2_alert,
        nutrient_3_enabled=sensor.nutrient_3_enabled,
        nutrient_3_type=sensor.nutrient_3_type,
        nutrient_3_alert=sensor.nutrient_3_alert,
        nutrient_4_enabled=sensor.nutrient_4_enabled,
        nutrient_4_type=sensor.nutrient_4_type,
        nutrient_4_alert=sensor.nutrient_4_alert,
        nutrient_5_enabled=sensor.nutrient_5_enabled,
        nutrient_5_type=sensor.nutrient_5_type,
        nutrient_5_alert=sensor.nutrient_5_alert,
        nutrient_6_enabled=sensor.nutrient_6_enabled,
        nutrient_6_type=sensor.nutrient_6_type,
        nutrient_6_alert=sensor.nutrient_6_alert,
        seconds_to_report=sensor.seconds_to_report,
        enabled=sensor.enabled,
        user=user,
        operation="delete"
    )
    await log.insert()

    # Eliminar el sensor
    await sensor.delete()
    
    
    
    return {"message": "Sensor de consumos eliminado correctamente"}
