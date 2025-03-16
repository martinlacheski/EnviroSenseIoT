from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.sensor_environmental_log import EnvironmentalSensorLog

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/sensors/environmental/log",
    tags=["environmental sensors log"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los logs de Sensores Ambientales
@router.get("/", response_model=List[EnvironmentalSensorLog])
async def get_environmental_sensor_logs(user: User = Depends(current_user)):
    logs = await EnvironmentalSensorLog.find(fetch_links=True).to_list()
    return logs

# Ruta para obtener un log de un Sensor Ambiental
@router.get("/{id}", response_model=EnvironmentalSensorLog)
async def get_environmental_sensor_log(id: PydanticObjectId, user: User = Depends(current_user)):
    log = await EnvironmentalSensorLog.get(id, fetch_links=True)
    if not log:
        raise HTTPException(status_code=404, detail="Log de sensor ambiental no encontrado")
    return log
