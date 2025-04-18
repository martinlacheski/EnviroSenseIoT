from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status

# Importamos Modelo y Esquema de la Entidad
from models.sensor_nutrient_solution_log import NutrientSolutionSensorLog
from models.user import User
from models.sensor_nutrient_solution import NutrientSolutionSensor

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Importamos el cliente MQTT
from utils.mqtt_dependencies import get_mqtt_client

# Importamos el método para actualizar el intervalo de reporte
from mqtt.aws_mqtt import update_device_report_interval

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/sensors/nutrients/solution",
    tags=[
        "nutrients solution sensors"
    ],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los Sensores de solución nutritiva
@router.get("/", response_model=List[NutrientSolutionSensor])
async def get_nutrient_solution_sensors(user: User = Depends(current_user)):
    sensors = await NutrientSolutionSensor.find(fetch_links=True).to_list()
    return sensors


# Ruta para obtener un Sensor de solución nutritiva
@router.get("/{id}", response_model=NutrientSolutionSensor)
async def get_nutrient_solution_sensor(id: PydanticObjectId, user: User = Depends(current_user)):
    sensor = await NutrientSolutionSensor.get(id, fetch_links=True)
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor de solución nutritiva no encontrado")
    return sensor


# Ruta para crear un Sensor de solucion nutritiva
@router.post("/", response_model=NutrientSolutionSensor, status_code=status.HTTP_201_CREATED)
async def create_nutrient_solution_sensor(sensor: NutrientSolutionSensor, user: User = Depends(current_user)):
    # Validar si ya existe un sensor con el mismo código
    existing_sensor = await NutrientSolutionSensor.find_one({"sensor_code": sensor.sensor_code})
    if existing_sensor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un sensor de solución nutritiva con ese código"
        )

    # Insertar el nuevo sensor
    await sensor.insert()

    # Crear el log de la operación
    log = NutrientSolutionSensorLog(
        environment=sensor.environment,
        description=sensor.description,
        sensor_code=sensor.sensor_code,
        temperature_alert_min=sensor.temperature_alert_min,
        temperature_alert_max=sensor.temperature_alert_max,
        tds_alert_min=sensor.tds_alert_min,
        tds_alert_max=sensor.tds_alert_max,
        ph_alert_min=sensor.ph_alert_min,
        ph_alert_max=sensor.ph_alert_max,
        ce_alert_min=sensor.ce_alert_min,
        ce_alert_max=sensor.ce_alert_max,
        seconds_to_report=sensor.seconds_to_report,
        enabled=sensor.enabled,
        user=user,
        operation="create"
    )
    await log.insert()
    
    return sensor


# Ruta para actualizar un Sensor de solución nutritiva
@router.put("/", response_model=NutrientSolutionSensor)
async def update_nutrient_solution_sensor(sensor: NutrientSolutionSensor, user: User = Depends(current_user)):
    # Verificar si el ID está presente
    if sensor.id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El ID del sensor es requerido para actualizar"
        )

    # Buscar el sensor existente
    existing_sensor = await NutrientSolutionSensor.get(sensor.id)
    if not existing_sensor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sensor de solución nutritiva no encontrado"
        )

    # Verificar si ya existe otro sensor con el mismo código (excluyendo el actual)
    duplicate = await NutrientSolutionSensor.find_one(
        {"sensor_code": sensor.sensor_code, "_id": {"$ne": sensor.id}}
    )
    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un sensor de solución nutritiva con ese código"
        )

    # Comprobar si se ha modificado el campo seconds_to_report
    if existing_sensor.seconds_to_report != sensor.seconds_to_report:
        mqtt_client = get_mqtt_client()
        await update_device_report_interval(  # Llama al método de la instancia
            mqtt_client,
            device_type="nutrient",
            device_code=sensor.sensor_code,
            seconds_to_report=sensor.seconds_to_report
        )

    # Actualizar el sensor
    await sensor.replace()

    # Crear el log de la operación
    log = NutrientSolutionSensorLog(
        environment=sensor.environment,
        description=sensor.description,
        sensor_code=sensor.sensor_code,
        temperature_alert_min=sensor.temperature_alert_min,
        temperature_alert_max=sensor.temperature_alert_max,
        tds_alert_min=sensor.tds_alert_min,
        tds_alert_max=sensor.tds_alert_max,
        ph_alert_min=sensor.ph_alert_min,
        ph_alert_max=sensor.ph_alert_max,
        ce_alert_min=sensor.ce_alert_min,
        ce_alert_max=sensor.ce_alert_max,
        seconds_to_report=sensor.seconds_to_report,
        enabled=sensor.enabled,
        user=user,
        operation="update"
    )
    await log.insert()
    
    return sensor


# Ruta para eliminar un Sensor de solución nutritiva
@router.delete("/{id}")
async def delete_nutrient_solution_sensor(id: PydanticObjectId, user: User = Depends(current_user)):
    # Buscar el sensor
    sensor = await NutrientSolutionSensor.get(id)
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor de solución nutritiva no encontrado")

    # Crear el log de la operación antes de eliminar el sensor
    log = NutrientSolutionSensorLog(
        environment=sensor.environment,
        description=sensor.description,
        sensor_code=sensor.sensor_code,
        temperature_alert_min=sensor.temperature_alert_min,
        temperature_alert_max=sensor.temperature_alert_max,
        tds_alert_min=sensor.tds_alert_min,
        tds_alert_max=sensor.tds_alert_max,
        ph_alert_min=sensor.ph_alert_min,
        ph_alert_max=sensor.ph_alert_max,
        ce_alert_min=sensor.ce_alert_min,
        ce_alert_max=sensor.ce_alert_max,
        seconds_to_report=sensor.seconds_to_report,
        enabled=sensor.enabled,
        user=user,
        operation="delete"
    )
    await log.insert()

    # Eliminar el sensor
    await sensor.delete()
    return {"message": "Sensor de solución nutritiva eliminado correctamente"}
