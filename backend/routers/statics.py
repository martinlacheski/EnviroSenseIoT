import datetime
from fastapi import APIRouter, File, UploadFile, HTTPException, UploadFile


# Importamos metodos de authentication
from utils.authentication import crypt, ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM

# Importamos cliente DB
from config import db_client

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/statics",
    tags=["statics"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)

@router.post("/uploadLogo")
async def upload_logo(file: UploadFile):
    try:
        # Generar un nombre de archivo único basado en la fecha y hora
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        file_extension = file.filename.split(".")[-1]  # Obtener la extensión del archivo
        unique_filename = f"{timestamp}.{file_extension}"

        # Guardar el archivo en la carpeta "static"
        file_path = f"static/images/{unique_filename}"
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        # Devolver la URL del archivo subido
        return {"url": f"/static/images/{unique_filename}"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))