from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status

# Importamos Modelo y Esquema de la Entidad
from models.sensor_consumption import ConsumptionSensor
from models.user import User
from models.nutrient_type import NutrientType

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/nutrients/types",
    tags=["nutrient types"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los Tipos de Nutrientes
@router.get("/", response_model=List[NutrientType])
async def get_nutrient_types(user: User = Depends(current_user)):
    return await NutrientType.find().to_list()


# Ruta para obtener un Tipo de Nutriente
@router.get("/{id}", response_model=NutrientType)
async def get_nutrient_type(id: PydanticObjectId, user: User = Depends(current_user)):
    nutrient_type = await NutrientType.get(id)
    if not nutrient_type:
        raise HTTPException(status_code=404, detail="Tipo de Nutriente no encontrado")
    return nutrient_type

# Ruta para crear un Tipo de Nutriente
@router.post("/", response_model=NutrientType, status_code=status.HTTP_201_CREATED)
async def create_nutrient_type(nutrient_type: NutrientType, user: User = Depends(current_user)):
    # Validar si ya existe un tipo de nutriente con el mismo nombre
    existing_type = await NutrientType.find_one({"name": nutrient_type.name})
    if existing_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un tipo de nutriente con ese nombre"
        )

    # Insertar el nuevo tipo de nutriente
    await nutrient_type.insert()
    return nutrient_type


# Ruta para actualizar un Tipo de Nutriente
@router.put("/", response_model=NutrientType)
async def update_nutrient_type(nutrient_type: NutrientType, user: User = Depends(current_user)):
    # Verificar si el ID está presente
    if nutrient_type.id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El ID del tipo de nutriente es requerido para actualizar"
        )

    # Buscar el tipo de nutriente existente
    existing_type = await NutrientType.get(nutrient_type.id)
    if not existing_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tipo de Nutriente no encontrado"
        )

    # Verificar si ya existe otro tipo de nutriente con el mismo nombre (excluyendo el actual)
    duplicate = await NutrientType.find_one(
        {"name": nutrient_type.name, "_id": {"$ne": nutrient_type.id}}
    )
    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un tipo de nutriente con ese nombre"
        )

    # Actualizar el tipo de nutriente
    await nutrient_type.replace()
    return nutrient_type


# Ruta para eliminar un Tipo de Nutriente
@router.delete("/{id}")
async def delete_nutrient_type(id: PydanticObjectId, user: User = Depends(current_user)):
    # Verificar si hay referencias a este tipo de nutriente
    nutrient_type_1 = await ConsumptionSensor.find(ConsumptionSensor.nutrient_1_type.id == id).to_list()
    nutrient_type_2 = await ConsumptionSensor.find(ConsumptionSensor.nutrient_2_type.id == id).to_list()
    nutrient_type_3 = await ConsumptionSensor.find(ConsumptionSensor.nutrient_3_type.id == id).to_list()
    nutrient_type_4 = await ConsumptionSensor.find(ConsumptionSensor.nutrient_4_type.id == id).to_list()
    nutrient_type_5 = await ConsumptionSensor.find(ConsumptionSensor.nutrient_5_type.id == id).to_list()
    nutrient_type_6 = await ConsumptionSensor.find(ConsumptionSensor.nutrient_6_type.id == id).to_list() 
    if nutrient_type_1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se puede eliminar el tipo de nutriente porque tiene sensores asociados"
        )
        
    if nutrient_type_2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se puede eliminar el tipo de nutriente porque tiene sensores asociados"
        )
        
    if nutrient_type_3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se puede eliminar el tipo de nutriente porque tiene sensores asociados"
        )
    
    if nutrient_type_4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se puede eliminar el tipo de nutriente porque tiene sensores asociados"
        )
        
    if nutrient_type_5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se puede eliminar el tipo de nutriente porque tiene sensores asociados"
        )
        
    if nutrient_type_6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se puede eliminar el tipo de nutriente porque tiene sensores asociados"
        )
    
    # Buscar el tipo de nutriente
    nutrient_type = await NutrientType.get(id)
    if not nutrient_type:
        raise HTTPException(status_code=404, detail="Tipo de Nutriente no encontrado")

    # Eliminar el tipo de nutriente
    await nutrient_type.delete()
    return {"message": "Tipo de Nutriente eliminado correctamente"}
