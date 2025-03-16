from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.role import Role

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/roles",
    tags=["roles"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los Roles
@router.get("/", response_model=List[Role])
async def get_roles(user: User = Depends(current_user)):
    return await Role.find().to_list()


# Ruta para obtener un Rol
@router.get("/{id}", response_model=Role)
async def get_role(id: PydanticObjectId, user: User = Depends(current_user)):
    role = await Role.get(id)
    if not role:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return role


# Ruta para crear un Rol
@router.post("/", response_model=Role, status_code=status.HTTP_201_CREATED)
async def create_role(role: Role, user: User = Depends(current_user)):
    # Validar si ya existe un rol con el mismo nombre
    existing_role = await Role.find_one({"name": role.name})
    if existing_role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un rol con ese nombre"
        )

    # Insertar el nuevo rol
    await role.insert()
    return role


# Ruta para actualizar un Rol
@router.put("/", response_model=Role)
async def update_role(role: Role, user: User = Depends(current_user)):
    # Verificar si el ID está presente
    if role.id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El ID del rol es requerido para actualizar"
        )

    # Buscar el rol existente
    existing_role = await Role.get(role.id)
    if not existing_role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rol no encontrado"
        )

    # Verificar si ya existe otro rol con el mismo nombre (excluyendo el actual)
    duplicate = await Role.find_one(
        {"name": role.name, "_id": {"$ne": role.id}}
    )
    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un rol con ese nombre"
        )

    # Actualizar el rol
    await role.replace()
    return role


# Ruta para eliminar un Rol
@router.delete("/{id}")
async def delete_role(id: PydanticObjectId, user: User = Depends(current_user)):
    # Verificar si hay referencias a este rol
    # (Aquí debes agregar la lógica para verificar si hay dependencias, si es necesario)

    # Buscar el rol
    role = await Role.get(id)
    if not role:
        raise HTTPException(status_code=404, detail="Rol no encontrado")

    # Eliminar el rol
    await role.delete()
    return {"message": "Rol eliminado correctamente"}
