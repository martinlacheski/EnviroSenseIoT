from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.sensor_nutrient_solution_data import NutrientSolutionSensorData

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/sensors/nutrients/solution/data",
    tags=[
        "nutrient solution sensors data"
    ],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los datos de Sensores de Solucion de Nutrientes
@router.get("/", response_model=List[NutrientSolutionSensorData])
async def get_nutrient_solution_sensor_data(user: User = Depends(current_user)):
    data = await NutrientSolutionSensorData.find().to_list()
    return data


# Ruta para obtener un Dato de Sensor de Solucion de Nutrientes
@router.get("/{id}", response_model=NutrientSolutionSensorData)
async def get_nutrient_solution_sensor_data(id: PydanticObjectId, user: User = Depends(current_user)):
    data = await NutrientSolutionSensorData.get(id)
    if not data:
        raise HTTPException(status_code=404, detail="Dato de sensor de solución de nutrientes no encontrado")
    return data


# Ruta para crear un Dato de Sensor de Solucion de Nutrientes
@router.post("/", response_model=NutrientSolutionSensorData, status_code=status.HTTP_201_CREATED)
async def create_nutrient_solution_sensor_data(sensor_data: NutrientSolutionSensorData):
    # Insertar el nuevo dato de sensor de solución de nutrientes
    await sensor_data.insert()
    return sensor_data
