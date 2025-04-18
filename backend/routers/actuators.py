from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status

# Importamos Modelo y Esquema de la Entidad
from models.actuator_log import ActuatorLog
from models.user import User
from models.actuator import Actuator

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Importamos el cliente MQTT
from utils.mqtt_dependencies import get_mqtt_client

# Importamos el método para actualizar el intervalo de reporte
from mqtt.aws_mqtt import update_device_report_interval

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/actuators",
    tags=["actuators"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)

# Ruta para obtener todos los Actuadores
@router.get("/", response_model=List[Actuator])
async def get_actuators(user: User = Depends(current_user)):
    actuators = await Actuator.find(fetch_links=True).to_list()
    return actuators

# Ruta para obtener un Actuador
@router.get("/{id}", response_model=Actuator)
async def get_actuator(id: PydanticObjectId, user: User = Depends(current_user)):
    actuator = await Actuator.get(id, fetch_links=True)
    if not actuator:
        raise HTTPException(status_code=404, detail="Actuador no encontrado")
    return actuator

# Ruta para crear un Actuador
@router.post("/", response_model=Actuator, status_code=status.HTTP_201_CREATED)
async def create_actuator(actuator: Actuator, user: User = Depends(current_user)):
    # Validar si ya existe un actuador con el mismo código
    existing_actuator = await Actuator.find_one({"actuator_code": actuator.actuator_code})
    if existing_actuator:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un actuador con ese código"
        )

    # Insertar el nuevo actuador
    await actuator.insert()

    # Crear el log de la operación
    log = ActuatorLog(
        environment=actuator.environment,
        description=actuator.description,
        actuator_code=actuator.actuator_code,
        relay_water_enabled=actuator.relay_water_enabled,
        relay_water_time=actuator.relay_water_time,
        relay_aerator_enabled=actuator.relay_aerator_enabled,
        relay_aerator_time=actuator.relay_aerator_time,
        relay_vent_enabled=actuator.relay_vent_enabled,
        relay_vent_time=actuator.relay_vent_time,
        relay_light_enabled=actuator.relay_light_enabled,
        relay_light_time=actuator.relay_light_time,
        relay_ph_plus_enabled=actuator.relay_ph_plus_enabled,
        relay_ph_plus_time=actuator.relay_ph_plus_time,
        relay_ph_minus_enabled=actuator.relay_ph_minus_enabled,
        relay_ph_minus_time=actuator.relay_ph_minus_time,
        relay_nutri_1_enabled=actuator.relay_nutri_1_enabled,
        relay_nutri_1_time=actuator.relay_nutri_1_time,
        relay_nutri_2_enabled=actuator.relay_nutri_2_enabled,
        relay_nutri_2_time=actuator.relay_nutri_2_time,
        relay_nutri_3_enabled=actuator.relay_nutri_3_enabled,
        relay_nutri_3_time=actuator.relay_nutri_3_time,
        relay_nutri_4_enabled=actuator.relay_nutri_4_enabled,
        relay_nutri_4_time=actuator.relay_nutri_4_time,
        seconds_to_report=actuator.seconds_to_report,
        enabled=actuator.enabled,
        user=user,
        operation="create"
    )
    await log.insert()
    
    return actuator


# Ruta para actualizar un Actuador
@router.put("/", response_model=Actuator)
#async def update_actuator(actuator: Actuator, user: User = Depends(current_user)):
async def update_actuator(actuator: Actuator, user: User = Depends(current_user)):
      
    # Verificar si el ID está presente
    if actuator.id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El ID del actuador es requerido para actualizar"
        )

    # Buscar el actuador existente
    existing_actuator = await Actuator.get(actuator.id)
    if not existing_actuator:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Actuador no encontrado"
        )

    # Verificar si ya existe otro actuador con el mismo código (excluyendo el actual)
    duplicate = await Actuator.find_one(
        {"actuator_code": actuator.actuator_code, "_id": {"$ne": actuator.id}}
    )
    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un actuador con ese código"
        )
        
    # Comprobar si se ha modificado el campo seconds_to_report
    if existing_actuator.seconds_to_report != actuator.seconds_to_report:
        mqtt_client = get_mqtt_client()
        await update_device_report_interval(  # Llama al método de la instancia
            mqtt_client,
            device_type="actuator",
            device_code=actuator.actuator_code,
            seconds_to_report=actuator.seconds_to_report
        )

    # Actualizar el actuador
    await actuator.replace()

    # Crear el log de la operación
    log = ActuatorLog(
        environment=actuator.environment,
        description=actuator.description,
        actuator_code=actuator.actuator_code,
        relay_water_enabled=actuator.relay_water_enabled,
        relay_water_time=actuator.relay_water_time,
        relay_aerator_enabled=actuator.relay_aerator_enabled,
        relay_aerator_time=actuator.relay_aerator_time,
        relay_vent_enabled=actuator.relay_vent_enabled,
        relay_vent_time=actuator.relay_vent_time,
        relay_light_enabled=actuator.relay_light_enabled,
        relay_light_time=actuator.relay_light_time,
        relay_ph_plus_enabled=actuator.relay_ph_plus_enabled,
        relay_ph_plus_time=actuator.relay_ph_plus_time,
        relay_ph_minus_enabled=actuator.relay_ph_minus_enabled,
        relay_ph_minus_time=actuator.relay_ph_minus_time,
        relay_nutri_1_enabled=actuator.relay_nutri_1_enabled,
        relay_nutri_1_time=actuator.relay_nutri_1_time,
        relay_nutri_2_enabled=actuator.relay_nutri_2_enabled,
        relay_nutri_2_time=actuator.relay_nutri_2_time,
        relay_nutri_3_enabled=actuator.relay_nutri_3_enabled,
        relay_nutri_3_time=actuator.relay_nutri_3_time,
        relay_nutri_4_enabled=actuator.relay_nutri_4_enabled,
        relay_nutri_4_time=actuator.relay_nutri_4_time,
        seconds_to_report=actuator.seconds_to_report,
        enabled=actuator.enabled,
        user=user,
        operation="update"
    )
    await log.insert()
    
    return actuator


# Ruta para eliminar un Actuador
@router.delete("/{id}")
async def delete_actuator(id: PydanticObjectId, user: User = Depends(current_user)):
    # Buscar el actuador
    actuator = await Actuator.get(id)
    if not actuator:
        raise HTTPException(status_code=404, detail="Actuador no encontrado")

    # Crear el log de la operación antes de eliminar el actuador
    log = ActuatorLog(
        environment=actuator.environment,
        description=actuator.description,
        actuator_code=actuator.actuator_code,
        relay_water_enabled=actuator.relay_water_enabled,
        relay_water_time=actuator.relay_water_time,
        relay_aerator_enabled=actuator.relay_aerator_enabled,
        relay_aerator_time=actuator.relay_aerator_time,
        relay_vent_enabled=actuator.relay_vent_enabled,
        relay_vent_time=actuator.relay_vent_time,
        relay_light_enabled=actuator.relay_light_enabled,
        relay_light_time=actuator.relay_light_time,
        relay_ph_plus_enabled=actuator.relay_ph_plus_enabled,
        relay_ph_plus_time=actuator.relay_ph_plus_time,
        relay_ph_minus_enabled=actuator.relay_ph_minus_enabled,
        relay_ph_minus_time=actuator.relay_ph_minus_time,
        relay_nutri_1_enabled=actuator.relay_nutri_1_enabled,
        relay_nutri_1_time=actuator.relay_nutri_1_time,
        relay_nutri_2_enabled=actuator.relay_nutri_2_enabled,
        relay_nutri_2_time=actuator.relay_nutri_2_time,
        relay_nutri_3_enabled=actuator.relay_nutri_3_enabled,
        relay_nutri_3_time=actuator.relay_nutri_3_time,
        relay_nutri_4_enabled=actuator.relay_nutri_4_enabled,
        relay_nutri_4_time=actuator.relay_nutri_4_time,
        seconds_to_report=actuator.seconds_to_report,
        enabled=actuator.enabled,
        user=user,  # Asignar directamente el objeto User
        operation="delete"
    )
    await log.insert()

    # Eliminar el actuador
    await actuator.delete()
    return {"message": "Actuador eliminado correctamente"}
