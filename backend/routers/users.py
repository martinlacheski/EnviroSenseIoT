from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from passlib.context import CryptContext

# Importamos Modelo y Esquema de la Entidad
from models.user import User, UpdateUser, UpdateUserPassword
from schemas.user import user_schema, users_schema

# Importamos cliente DB
from config import db_client

# Importamos utilidades
from services.users import search_user

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

crypt = CryptContext(schemes=["bcrypt"], deprecated="auto")

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
            error="Ya existe un usuario con ese correo electrónico",
        )
    if type(search_user("username", user.username)) == User:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            error="Ya existe un usuario con ese nombre de usuario",
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


@router.patch("/", response_model=User)
async def update_user_name(
    user: UpdateUser, current_user: User = Depends(current_user)
):
    # Buscar el usuario en la base de datos
    stored_item_data = dict(search_user("_id", ObjectId(user.id)))
    if not stored_item_data:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Solo se permiten actualizar los campos name y surname
    update_data = {"name": user.name, "surname": user.surname}

    # Actualizar el usuario en la base de datos
    db_client.users.find_one_and_update(
        {"_id": ObjectId(user.id)}, {"$set": update_data}
    )

    # Buscar el usuario actualizado y retornarlo
    updated_item_data = dict(search_user("_id", ObjectId(user.id)))
    updated_item = User(**updated_item_data)
    return updated_item


# Ruta para actualizar la contraseña de un Usuario
@router.patch("/change/password")
async def change_password(
    user: UpdateUserPassword, current_user: User = Depends(current_user)
):
    print(user)
    # Buscar el usuario en la base de datos
    stored_item_data = db_client.users.find_one({"_id": ObjectId(current_user.id)})
    if not stored_item_data:
        # return {"message": "Usuario no encontrado"}
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    stored_item_model = User(**stored_item_data)

    # Verificar si la contraseña actual es válida
    if not crypt.verify(user.current_password, stored_item_model.password):
        # return {"message": "Contraseña actual incorrecta"}
        raise HTTPException(status_code=400, detail="Contraseña actual incorrecta")

    # Verificar que las nuevas contraseñas coincidan
    if user.new_password != user.new_password_confirmation:
        # return {"message": "Las contraseñas no coinciden"}
        raise HTTPException(status_code=400, detail="Las contraseñas no coinciden")

    # Hashear la nueva contraseña
    hashed_new_password = crypt.hash(user.new_password)

    # Actualizar el usuario en la base de datos
    db_client.users.find_one_and_update(
        {"_id": ObjectId(current_user.id)}, {"$set": {"password": hashed_new_password}}
    )

    return {"message": "Contraseña actualizada exitosamente"}


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
