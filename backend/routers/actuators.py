from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status

# Importamos Modelo y Esquema de la Entidad
from models.actuator_log import ActuatorLog
from models.user import User
from models.actuator import Actuator

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

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
        channel_1_enabled=actuator.channel_1_enabled,
        channel_1_name=actuator.channel_1_name,
        channel_1_time=actuator.channel_1_time,
        channel_2_enabled=actuator.channel_2_enabled,
        channel_2_name=actuator.channel_2_name,
        channel_2_time=actuator.channel_2_time,
        channel_3_enabled=actuator.channel_3_enabled,
        channel_3_name=actuator.channel_3_name,
        channel_3_time=actuator.channel_3_time,
        channel_4_enabled=actuator.channel_4_enabled,
        channel_4_name=actuator.channel_4_name,
        channel_4_time=actuator.channel_4_time,
        channel_5_enabled=actuator.channel_5_enabled,
        channel_5_name=actuator.channel_5_name,
        channel_5_time=actuator.channel_5_time,
        channel_6_enabled=actuator.channel_6_enabled,
        channel_6_name=actuator.channel_6_name,
        channel_6_time=actuator.channel_6_time,
        channel_7_enabled=actuator.channel_7_enabled,
        channel_7_name=actuator.channel_7_name,
        channel_7_time=actuator.channel_7_time,
        channel_8_enabled=actuator.channel_8_enabled,
        channel_8_name=actuator.channel_8_name,
        channel_8_time=actuator.channel_8_time,
        minutes_to_report=actuator.minutes_to_report,
        enabled=actuator.enabled,
        user=user,
        operation="create"
    )
    await log.insert()
    
    return actuator


# Ruta para actualizar un Actuador
@router.put("/", response_model=Actuator)
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

    # Actualizar el actuador
    await actuator.replace()

    # Crear el log de la operación
    log = ActuatorLog(
        environment=actuator.environment,
        description=actuator.description,
        actuator_code=actuator.actuator_code,
        channel_1_enabled=actuator.channel_1_enabled,
        channel_1_name=actuator.channel_1_name,
        channel_1_time=actuator.channel_1_time,
        channel_2_enabled=actuator.channel_2_enabled,
        channel_2_name=actuator.channel_2_name,
        channel_2_time=actuator.channel_2_time,
        channel_3_enabled=actuator.channel_3_enabled,
        channel_3_name=actuator.channel_3_name,
        channel_3_time=actuator.channel_3_time,
        channel_4_enabled=actuator.channel_4_enabled,
        channel_4_name=actuator.channel_4_name,
        channel_4_time=actuator.channel_4_time,
        channel_5_enabled=actuator.channel_5_enabled,
        channel_5_name=actuator.channel_5_name,
        channel_5_time=actuator.channel_5_time,
        channel_6_enabled=actuator.channel_6_enabled,
        channel_6_name=actuator.channel_6_name,
        channel_6_time=actuator.channel_6_time,
        channel_7_enabled=actuator.channel_7_enabled,
        channel_7_name=actuator.channel_7_name,
        channel_7_time=actuator.channel_7_time,
        channel_8_enabled=actuator.channel_8_enabled,
        channel_8_name=actuator.channel_8_name,
        channel_8_time=actuator.channel_8_time,
        minutes_to_report=actuator.minutes_to_report,
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
        channel_1_enabled=actuator.channel_1_enabled,
        channel_1_name=actuator.channel_1_name,
        channel_1_time=actuator.channel_1_time,
        channel_2_enabled=actuator.channel_2_enabled,
        channel_2_name=actuator.channel_2_name,
        channel_2_time=actuator.channel_2_time,
        channel_3_enabled=actuator.channel_3_enabled,
        channel_3_name=actuator.channel_3_name,
        channel_3_time=actuator.channel_3_time,
        channel_4_enabled=actuator.channel_4_enabled,
        channel_4_name=actuator.channel_4_name,
        channel_4_time=actuator.channel_4_time,
        channel_5_enabled=actuator.channel_5_enabled,
        channel_5_name=actuator.channel_5_name,
        channel_5_time=actuator.channel_5_time,
        channel_6_enabled=actuator.channel_6_enabled,
        channel_6_name=actuator.channel_6_name,
        channel_6_time=actuator.channel_6_time,
        channel_7_enabled=actuator.channel_7_enabled,
        channel_7_name=actuator.channel_7_name,
        channel_7_time=actuator.channel_7_time,
        channel_8_enabled=actuator.channel_8_enabled,
        channel_8_name=actuator.channel_8_name,
        channel_8_time=actuator.channel_8_time,
        minutes_to_report=actuator.minutes_to_report,
        enabled=actuator.enabled,
        user=user,  # Asignar directamente el objeto User
        operation="delete"
    )
    await log.insert()

    # Eliminar el actuador
    await actuator.delete()
    return {"message": "Actuador eliminado correctamente"}
