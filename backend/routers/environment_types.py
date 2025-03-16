from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status

# Importamos Modelo y Esquema de la Entidad
from models.environment import Environment
from models.environment_type import EnvironmentType

# Importamos metodo de autenticación JWT
from models.user import User
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/environments/types",
    tags=["environment types"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los Tipos de Ambientes
@router.get("/", response_model=List[EnvironmentType])
async def get_environment_types(user: User = Depends(current_user)):
    return await EnvironmentType.find().to_list()
    

# Ruta para obtener un Tipo de Ambiente
@router.get("/{id}", response_model=dict)
async def get_environment_type(id: PydanticObjectId, user: User = Depends(current_user)):
    env_type = await EnvironmentType.get(id)
    if not env_type:
        raise HTTPException(status_code=404, detail="Tipo de Ambiente no encontrado")
    
    return {
        "id": str(env_type.id),
        "name": env_type.name
    }


# Ruta para crear un Tipo de Ambiente
@router.post("/", response_model=EnvironmentType, status_code=status.HTTP_201_CREATED)
async def create_environment_type(environment_type: EnvironmentType, user: User = Depends(current_user)):
    # Validar si ya existe un tipo de ambiente con el mismo nombre
    existing_type = await EnvironmentType.find_one({"name": environment_type.name})
    if existing_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un tipo de ambiente con ese nombre"
        )

    await environment_type.insert()
    return environment_type


# Ruta para actualizar un Tipo de Ambiente
@router.put("/", response_model=EnvironmentType)
async def update_environment_type(environment_type: EnvironmentType, user: User = Depends(current_user)):
    # Verifica que el ID esté presente en el cuerpo de la solicitud
    if environment_type.id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El ID del tipo de ambiente es requerido para actualizar"
        )

    # Busca el tipo de ambiente existente por ID
    existing_type = await EnvironmentType.get(environment_type.id)
    if not existing_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tipo de Ambiente no encontrado"
        )

    # Verifica si ya existe otro tipo de ambiente con el mismo nombre
    duplicate = await EnvironmentType.find_one(
        {"name": environment_type.name, "_id": {"$ne": environment_type.id}}
    )
    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un tipo de ambiente con ese nombre"
        )

    # Actualiza el tipo de ambiente
    await environment_type.replace()
    return environment_type


# Ruta para eliminar un Tipo de Ambiente
@router.delete("/{id}")
async def delete_environment_type(id: PydanticObjectId, user: User = Depends(current_user)):

    # Verificar si hay Ambientes que referencien este Tipo de Ambiente
    environments = await Environment.find(Environment.type.id == id).to_list()

    if environments:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se puede eliminar el tipo de ambiente porque tiene ambientes asociados"
        )

    # Si no hay referencias, eliminar el tipo de ambiente
    env_type = await EnvironmentType.get(id)
    if not env_type:
        raise HTTPException(status_code=404, detail="Tipo de Ambiente no encontrado")
    
    # Eliminar el tipo de ambiente
    await env_type.delete()

    # Respuesta exitosa
    return {"message": "Tipo de Ambiente eliminado correctamente"}