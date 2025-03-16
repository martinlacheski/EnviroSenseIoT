from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.sensor_nutrient_solution_log import NutrientSolutionSensorLog

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/sensors/nutrients/solution/log",
    tags=[
        "nutrient solution sensors log"
    ],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los logs de Sensores de solucion nutritiva
@router.get("/", response_model=List[NutrientSolutionSensorLog])
async def get_nutrient_solution_sensor_logs(user: User = Depends(current_user)):
    logs = await NutrientSolutionSensorLog.find(fetch_links=True).to_list()
    return logs

# Ruta para obtener un log de un Sensor de solucion nutritiva
@router.get("/{id}", response_model=NutrientSolutionSensorLog)
async def get_nutrient_solution_sensor_log(id: PydanticObjectId, user: User = Depends(current_user)):
    log = await NutrientSolutionSensorLog.get(id, fetch_links=True)
    if not log:
        raise HTTPException(status_code=404, detail="Log de sensor de solución nutritiva no encontrado")
    return log