from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.nutrient_type import NutrientType
from schemas.nutrient_type import nutrient_type_schema, nutrient_types_schema

# Importamos cliente DB
from config import db_client

# Importamos utilidades
from services.nutrient_type import search_nutrient_type

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/nutrients/types",
    tags=["nutrient types"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los Tipos de Nutrientes
@router.get("/")
async def nutrient_types(user: User = Depends(current_user)):
    return nutrient_types_schema(db_client.nutrient_types.find())


# Ruta para obtener un Tipo de Nutriente
@router.get("/{id}")  # Path
async def nutrient_type(id: str, current_user: User = Depends(current_user)):

    return search_nutrient_type("_id", ObjectId(id))


# Ruta para crear un Tipo de Nutriente
@router.post("/", response_model=NutrientType, status_code=status.HTTP_201_CREATED)
async def nutrient_type(nutrient_type: NutrientType, current_user: User = Depends(current_user)):

    if type(search_nutrient_type("name", nutrient_type.name)) == NutrientType:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ya existe un tipo de nutriente con ese nombre",
        )

    nutrient_type_dict = dict(nutrient_type)
    del nutrient_type_dict["id"]

    # Crear el Tipo de Nutriente en la BD y obtener el ID
    id = db_client.nutrient_types.insert_one(nutrient_type_dict).inserted_id

    # Buscar el Tipo de Nutriente creado y devolverlo
    new_nutrient_type = nutrient_type_schema(db_client.nutrient_types.find_one({"_id": id}))

    return NutrientType(**new_nutrient_type)


# Ruta para actualizar un Tipo de Nutriente
@router.put("/", response_model=NutrientType)
async def nutrient_type(nutrient_type: NutrientType, current_user: User = Depends(current_user)):

    nutrient_type_dict = dict(nutrient_type)
    del nutrient_type_dict["id"]
    
    if not db_client.nutrient_types.find_one({"_id": ObjectId(nutrient_type.id)}):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No existe un tipo de nutriente con ese identificador",
        )

    try:
        db_client.nutrient_types.find_one_and_replace({"_id": ObjectId(nutrient_type.id)}, nutrient_type_dict)
    except:
        return {"error": "No se ha actualizado el tipo de nutriente"}

    return search_nutrient_type("_id", ObjectId(nutrient_type.id))


# Ruta para eliminar un Tipo de Nutriente
@router.delete("/{id}")
async def nutrient_type(id: str, current_user: User = Depends(current_user)):

    found = db_client.nutrient_types.find_one_and_delete({"_id": ObjectId(id)})
    if found == None:
        return {"error": "No se ha encontrado el tipo de nutriente"}
    else:
        return {"mensaje": "Tipo de nutriente eliminado"}
