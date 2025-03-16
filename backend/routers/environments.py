from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.environment import Environment

# Importamos metodo de autenticación JWT
from utils.authentication import current_user


# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/environments",
    tags=["environments"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los Ambientes
@router.get("/", response_model=List[Environment])
async def get_environments(user: dict = Depends(current_user)):
    return await Environment.find(fetch_links=True).to_list()


# Ruta para obtener un Ambiente
@router.get("/{id}", response_model=Environment)
async def get_environment(id: PydanticObjectId, user: User = Depends(current_user)):
    environment = await Environment.get(id, fetch_links=True)
    if not environment:
        raise HTTPException(status_code=404, detail="Ambiente no encontrado")
    return environment


# Ruta para crear un Ambiente
@router.post("/", response_model=Environment, status_code=status.HTTP_201_CREATED)
async def create_environment(environment: Environment, user: User = Depends(current_user)):
    # Verificar si ya existe un ambiente con el mismo nombre
    existing_environment = await Environment.find_one({"name": environment.name})
    if existing_environment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un ambiente con ese nombre"
        )

    # Insertar el nuevo ambiente
    await environment.insert()
    return environment


# Ruta para actualizar un Ambiente
@router.put("/", response_model=Environment)
async def update_environment(environment: Environment, user: User = Depends(current_user)):
    # Verificar si el ID está presente
    if environment.id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El ID del ambiente es requerido para actualizar"
        )

    # Buscar el ambiente existente
    existing_environment = await Environment.get(environment.id)
    if not existing_environment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ambiente no encontrado"
        )

    # Verificar si ya existe otro ambiente con el mismo nombre (excluyendo el actual)
    duplicate = await Environment.find_one(
        {"name": environment.name, "_id": {"$ne": environment.id}}
    )
    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un ambiente con ese nombre"
        )

    # Actualizar el ambiente
    await environment.replace()
    return environment


# Ruta para eliminar un Ambiente
@router.delete("/{id}")
async def delete_environment(id: PydanticObjectId, user: User = Depends(current_user)):
    # Buscar el ambiente
    environment = await Environment.get(id)
    if not environment:
        raise HTTPException(status_code=404, detail="Ambiente no encontrado")

    # Eliminar el ambiente
    await environment.delete()
    return {"message": "Ambiente eliminado correctamente"}