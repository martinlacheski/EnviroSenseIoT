from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
import jwt


# Importamos Modelo y Esquema de la Entidad
from models.user import User
from schemas.user import user_schema, users_schema

# Importamos metodos de authentication
from utils.authentication import crypt, ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM

# Importamos cliente DB
from config import db_client

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="",
    tags=["login"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)

@router.post("/login")
async def login(form: OAuth2PasswordRequestForm = Depends()):
    user = db_client.users.find_one({"username": form.username})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="El usuario no es correcto")
    if not crypt.verify(form.password, user.get("password")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La contraseña no es correcta",
        )

    access_token = {
        "sub": user.get("username"),
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    }

    return {
        "access_token": jwt.encode(access_token, SECRET_KEY, algorithm=ALGORITHM),
        "token_type": "bearer",
        "exp": access_token["exp"],
    }

