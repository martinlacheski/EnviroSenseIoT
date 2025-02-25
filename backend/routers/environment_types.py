from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.environment_type import EnvironmentType
from schemas.environment_type import environment_type_schema, environment_types_schema

# Importamos cliente DB
from config import db_client

# Importamos utilidades
from services.environment_type import search_environment_type

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/environments/types",
    tags=["environment types"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los Tipos de Ambientes
@router.get("/")
async def environment_types(user: User = Depends(current_user)):
    return environment_types_schema(db_client.environment_types.find())


# Ruta para obtener un Tipo de Ambiente
@router.get("/{id}")  # Path
async def environment_type(id: str, current_user: User = Depends(current_user)):

    return search_environment_type("_id", ObjectId(id))


# Ruta para crear un Tipo de Ambiente
@router.post("/", response_model=EnvironmentType, status_code=status.HTTP_201_CREATED)
async def environment_type(environment_type: EnvironmentType, current_user: User = Depends(current_user)):
    
    if type(search_environment_type("name", environment_type.name)) == EnvironmentType:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ya existe un tipo de ambiente con ese nombre",
        )

    environment_type_dict = dict(environment_type)
    del environment_type_dict["id"]

    # Crear el Tipo de Ambiente en la BD y obtener el ID
    id = db_client.environment_types.insert_one(environment_type_dict).inserted_id

    # Buscar el Tipo de Ambiente creado y devolverlo
    new_environment_type = environment_type_schema(db_client.environment_types.find_one({"_id": id}))

    return EnvironmentType(**new_environment_type)


# Ruta para actualizar un Tipo de Ambiente
@router.put("/", response_model=EnvironmentType)
async def environment_type(environment_type: EnvironmentType, current_user: User = Depends(current_user)):

    environment_type_dict = dict(environment_type)
    del environment_type_dict["id"]

    try:
        db_client.environment_types.find_one_and_replace({"_id": ObjectId(environment_type.id)}, environment_type_dict)
    except:
        return {"error": "No se ha actualizado el tipo de ambiente"}

    return search_environment_type("_id", ObjectId(environment_type.id))


# Ruta para eliminar un Tipo de Ambiente
@router.delete("/{id}")
async def environment_type(id: str, current_user: User = Depends(current_user)):

    found = db_client.environment_types.find_one_and_delete({"_id": ObjectId(id)})
    if found == None:
        return {"error": "No se ha encontrado el tipo de ambiente"}
    else:
        return {"mensaje": "Tipo de ambiente eliminado"}
