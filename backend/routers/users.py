from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

# Importamos Modelo y Esquema de la Entidad
from models.user import User, UpdateUser
from schemas.user import user_schema, users_schema

# Importamos cliente DB
from config import db_client

# Importamos utilidades
from services.users import search_user

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/users",
    tags=["users"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los Usuarios
@router.get("/")
async def users(user: User = Depends(current_user)):
    return users_schema(db_client.users.find())


# Ruta para obtener un Usuario
@router.get("/{id}")  # Path
async def user(id: str, user: User = Depends(current_user)):

    return search_user("_id", ObjectId(id))


# Ruta para crear un Usuario
@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
async def user(user: User, current_user: User = Depends(current_user)):

    if type(search_user("email", user.email)) == User:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ya existe un usuario con ese correo electrónico",
        )
    if type(search_user("username", user.username)) == User:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ya existe un usuario con ese nombre de usuario",
        )

    user_dict = dict(user)
    del user_dict["id"]

    # Crear el Usuario en la BD y obtener el ID
    id = db_client.users.insert_one(user_dict).inserted_id

    # Buscar el usuario creado y devolverlo
    new_user = user_schema(db_client.users.find_one({"_id": id}))

    return User(**new_user)


# Ruta para actualizar un Usuario
@router.put("/", response_model=User)
async def user(user: User, current_user: User = Depends(current_user)):

    user_dict = dict(user)
    del user_dict["id"]

    try:
        db_client.users.find_one_and_replace({"_id": ObjectId(user.id)}, user_dict)
    except:
        return {"error": "No se ha actualizado el usuario"}

    return search_user("_id", ObjectId(user.id))


# Ruta para actualizar parte de un Usuario
@router.patch("/", response_model=User)
async def user(user: UpdateUser, current_user: User = Depends(current_user)):

    stored_item_data = dict(search_user("_id", ObjectId(user.id)))
    stored_item_model = User(**stored_item_data)
    update_data = user.model_dump(exclude_unset=True)
    updated_item = stored_item_model.model_copy(update=update_data)
    db_client.users.find_one_and_replace({"_id": ObjectId(user.id)}, dict(updated_item))
    return updated_item


# Ruta para eliminar un Usuario
@router.delete("/{id}")
async def user(id: str, current_user: User = Depends(current_user)):

    found = db_client.users.find_one_and_delete({"_id": ObjectId(id)})
    if found == None:
        return {"error": "No se ha encontrado el usuario"}
    else:
        return {"mensaje": "Usuario eliminado"}


# Ruta para acceder al panel de usuario
@router.get("/me/")
async def me(current_user: User = Depends(current_user)):
    return current_user
