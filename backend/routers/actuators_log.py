from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.actuator_log import ActuatorLog

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/actuators/log",
    tags=["actuators log"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los logs de Actuadores
@router.get("/", response_model=List[ActuatorLog])
async def get_consumption_sensor_logs(user: User = Depends(current_user)):
    logs = await ActuatorLog.find(fetch_links=True).to_list()
    return logs

# Ruta para obtener un log de un Actuador
@router.get("/{id}", response_model=ActuatorLog)
async def get_consumption_sensor_log(id: PydanticObjectId, user: User = Depends(current_user)):
    log = await ActuatorLog.get(id, fetch_links=True)
    if not log:
        raise HTTPException(status_code=404, detail="Log de actuador no encontrado")
    return log
