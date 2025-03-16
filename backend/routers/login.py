from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
import jwt

# Importamos Modelo y Esquema de la Entidad
from models.user import User

# Importamos métodos de autenticación
from utils.authentication import crypt, ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="",
    tags=["login"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)

@router.post("/login")
async def login(form: OAuth2PasswordRequestForm = Depends()):
    # Buscar el usuario por nombre de usuario
    user = await User.find_one({"username": form.username})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Los datos ingresados no son correctos",
        )

    # Verificar la contraseña
    if not crypt.verify(form.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Los datos ingresados no son correctos",
        )

    # Verificar si el usuario está habilitado
    if not user.enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario deshabilitado",
        )

    # Crear el token de acceso
    access_token = {
        "_id": str(user.id),
        "username": user.username,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    }

    return {
        "access_token": jwt.encode(access_token, SECRET_KEY, algorithm=ALGORITHM),
        "token_type": "bearer",
        "exp": access_token["exp"],
    }