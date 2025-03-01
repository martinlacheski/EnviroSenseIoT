from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.role import Role
from schemas.role import role_schema, roles_schema

# Importamos cliente DB
from config import db_client

# Importamos utilidades
from services.roles import search_role

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/roles",
    tags=["roles"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los Roles
@router.get("/")
async def roles(user: User = Depends(current_user)):
    return roles_schema(db_client.roles.find())


# Ruta para obtener un Rol
@router.get("/{id}")  # Path
async def role(id: str, current_user: User = Depends(current_user)):

    return search_role("_id", ObjectId(id))


# Ruta para crear un Rol
@router.post("/", response_model=Role, status_code=status.HTTP_201_CREATED)
async def role(role: Role, current_user: User = Depends(current_user)):

    if type(search_role("name", role.name)) == Role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ya existe un rol con ese nombre",
        )

    role_dict = dict(role)
    del role_dict["id"]

    # Crear el Rol en la BD y obtener el ID
    id = db_client.roles.insert_one(role_dict).inserted_id

    # Buscar el rol creado y devolverlo
    new_role = role_schema(db_client.countries.find_one({"_id": id}))

    return Role(**new_role)


# Ruta para actualizar un Rol
@router.put("/", response_model=Role)
async def role(role: Role, current_user: User = Depends(current_user)):
    # Verificar si ya existe un rol con el mismo nombre (excluyendo el actual)
    existing_type = db_client.roles.find_one({"name": role.name, "_id": {"$ne": ObjectId(role.id)}})
    if existing_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un rol con ese nombre",
        )

    role_dict = dict(role)
    del role_dict["id"]

    try:
        db_client.roles.find_one_and_replace({"_id": ObjectId(role.id)}, role_dict)
    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se ha actualizado el rol",
        )

    updated_role = search_role("_id", ObjectId(role.id))
    if not updated_role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontró el rol",
        )

    return updated_role


# Ruta para eliminar un Rol
@router.delete("/{id}")
async def role(id: str, current_user: User = Depends(current_user)):

    found = db_client.roles.find_one_and_delete({"_id": ObjectId(id)})
    if found == None:
        return {"error": "No se ha encontrado el rol"}
    else:
        return {"mensaje": "Rol eliminado"}
