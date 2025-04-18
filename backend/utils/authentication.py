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
SECRET_KEY = "ff2031bb7ab10940108585eb799adecca55aafee12572b36d3060e4c7123724c"  # Clave Secreta generada
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120

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