from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
import jwt
import bcrypt

# Importamos Modelo y Esquema de la Entidad
from models.user import User

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="",
    tags=["login"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)

# to get a string like this run:
# ejecutar comando: openssl rand -hex 32
# importamos las claves de seguridad desde .env
from dotenv import load_dotenv
import os
load_dotenv()
# Si no existe la variable de entorno, se lanza un error
# Si existe, se asigna a la variable SECRET_KEY
SECRET_KEY = os.getenv("BACKEND_SECRET_KEY")
if SECRET_KEY is None:
    raise ValueError("No se encontró la clave secreta en las variables de entorno")

# Si no existe la variable de entorno, se lanza un error
# Si existe, se asigna a la variable ALGORITHM
ALGORITHM = os.getenv("BACKEND_ALGORITHM")
if ALGORITHM is None:
    raise ValueError("No se encontró el algoritmo en las variables de entorno")

# Si no existe la variable de entorno, se lanza un error
# Si existe, se asigna a la variable REFRESH_TOKEN_EXPIRE_MINUTES
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("BACKEND_ACCESS_TOKEN_EXPIRE_MINUTES")
if ACCESS_TOKEN_EXPIRE_MINUTES is None:
    raise ValueError("No se encontró el tiempo de expiración del token en las variables de entorno")
ACCESS_TOKEN_EXPIRE_MINUTES = int(ACCESS_TOKEN_EXPIRE_MINUTES)

oauth2 = OAuth2PasswordBearer(tokenUrl="login")

crypt = CryptContext(schemes=["bcrypt"], deprecated="auto")

class SolveBugBcryptWarning:
    __version__: str = getattr(bcrypt, "__version__")


setattr(bcrypt, "__about__", SolveBugBcryptWarning())


async def auth_user(token: str = Depends(oauth2)):
    exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales de autenticación inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        username = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]).get("username")
        if username is None:
            raise exception

    except:
        raise exception

    # Buscar el usuario por nombre de usuario
    user = await User.find_one({"username": username})
    if not user:
        raise exception

    return user


async def current_user(user: User = Depends(auth_user)):
    if not user.enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Usuario deshabilitado"
        )

    return user