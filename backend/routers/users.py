from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from passlib.context import CryptContext

# Importamos Modelo y Esquema de la Entidad
from models.user import UpdateCurrentUser, UpdateCurrentUserPassword, User, UpdateUserPassword

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
@router.get("/", response_model=List[User])
async def get_users(user: User = Depends(current_user)):
    return await User.find().to_list()


# Ruta para obtener un Usuario
@router.get("/{id}", response_model=User)
async def get_user(id: PydanticObjectId, user: User = Depends(current_user)):
    user = await User.get(id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user


# Ruta para crear un Usuario
@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(user: User, current_user: User = Depends(current_user)):
    # Verificar si el correo ya existe
    existing_user = await User.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un usuario con ese correo electrónico",
        )

    # Verificar si el nombre de usuario ya existe
    existing_user = await User.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un usuario con ese nombre de usuario",
        )

    # Hashear la contraseña antes de guardarla
    user.password = crypt.hash(user.password)
    await user.insert()
    return user

# Ruta para actualizar un Usuario
@router.put("/", response_model=User)
async def update_user(user: User, current_user: User = Depends(current_user)):
    if user.id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El ID del usuario es requerido para actualizar"
        )

    existing_user = await User.get(user.id)
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    # Verificar si ya existe un usuario con el mismo nombre de usuario (excluyendo el actual)
    duplicate = await User.find_one({"username": user.username, "_id": {"$ne": user.id}})
    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un usuario con ese nombre de usuario"
        )

    # Verificar si ya existe un usuario con el mismo correo electrónico (excluyendo el actual)
    duplicate = await User.find_one({"email": user.email, "_id": {"$ne": user.id}})
    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un usuario con ese correo electrónico"
        )

    await user.replace()
    return user


# Ruta para actualizar el nombre y apellido de un Usuario
@router.patch("/", response_model=User)
async def update_user_name(user: UpdateCurrentUser, current_user: User = Depends(current_user)):
    existing_user = await User.get(user.id)
    if not existing_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Actualizar solo los campos permitidos
    existing_user.name = user.name
    existing_user.surname = user.surname
    await existing_user.save()
    return existing_user


# Ruta para actualizar la contraseña de un Usuario
@router.patch("/password")
async def change_password(user: UpdateUserPassword, current_user: User = Depends(current_user)):
    existing_user = await User.get(user.id)
    if not existing_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if user.new_password != user.new_password_confirmation:
        raise HTTPException(status_code=400, detail="Las contraseñas no coinciden")

    existing_user.password = crypt.hash(user.new_password)
    await existing_user.save()
    return {"message": "Contraseña actualizada exitosamente"}


# Ruta para eliminar un Usuario
@router.delete("/{id}")
async def delete_user(id: PydanticObjectId, current_user: User = Depends(current_user)):
    user = await User.get(id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    await user.delete()
    return {"message": "Usuario eliminado correctamente"}


# Ruta para acceder al panel de usuario
@router.get("/me/", response_model=User)
async def get_me(current_user: User = Depends(current_user)):
    return current_user

# Ruta para actualizar la contraseña del usuario actual
@router.patch("/change/password")
async def change_current_user_password(user: UpdateCurrentUserPassword, current_user: User = Depends(current_user)):
    existing_user = await User.get(current_user.id)
    if not existing_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if not crypt.verify(user.current_password, existing_user.password):
        raise HTTPException(status_code=400, detail="Contraseña actual incorrecta")

    if user.new_password != user.new_password_confirmation:
        raise HTTPException(status_code=400, detail="Las contraseñas no coinciden")

    existing_user.password = crypt.hash(user.new_password)
    await existing_user.save()
    return {"message": "Contraseña actualizada exitosamente"}