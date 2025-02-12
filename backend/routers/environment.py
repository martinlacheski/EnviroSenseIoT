from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.environment import Environment
from schemas.environment import environment_schema, environments_schema

# Importamos cliente DB
from config import db_client

# Importamos utilidades
from services.environment import search_environment

# Importamos metodo de autenticación JWT
from utils.authentication import current_user


# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/environments",
    tags=["environments"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todas los Ambientes
@router.get("/")
async def environments(user: User = Depends(current_user)):
    return environments_schema(db_client.environments.find())


# Ruta para obtener un Ambiente
@router.get("/{id}")  # Path
async def environment(id: str, user: User = Depends(current_user)):

    return search_environment("_id", ObjectId(id))


# Ruta para crear un Ambiente
@router.post("/", response_model=Environment, status_code=status.HTTP_201_CREATED)
async def environment(environment: Environment, current_user: User = Depends(current_user)):

    if type(search_environment("name", environment.name)) == Environment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ya existe un ambiente con ese nombre",
        )

    environment_dict = dict(environment)
    del environment_dict["id"]

    # Crear el Ambiente en la BD y obtener el ID
    id = db_client.environments.insert_one(environment_dict).inserted_id

    # Buscar el Ambiente creado y devolverlo
    new_environment = environment_schema(db_client.environments.find_one({"_id": id}))

    return Environment(**new_environment)


# Ruta para actualizar un Ambiente
@router.put("/", response_model=Environment)
async def environment(environment: Environment, current_user: User = Depends(current_user)):

    environment_dict = dict(environment)
    del environment_dict["id"]

    try:
        db_client.environments.find_one_and_replace({"_id": ObjectId(environment.id)}, environment_dict)
    except:
        return {"error": "No se ha actualizado el ambiente"}

    return search_environment("_id", ObjectId(environment.id))


# Ruta para eliminar un Ambiente
@router.delete("/{id}")
async def environment(id: str, current_user: User = Depends(current_user)):

    found = db_client.environments.find_one_and_delete({"_id": ObjectId(id)})
    if found == None:
        return {"error": "No se ha encontrado el ambiente"}
    else:
        return {"mensaje": "Ambiente eliminado"}
