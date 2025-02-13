from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.actuator import Actuator
from schemas.actuator import actuator_schema, actuators_schema

# Importamos cliente DB
from config import db_client

# Importamos utilidades
from services.actuators import search_actuator

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/actuators",
    tags=["actuators"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los Actuadores
@router.get("/")
async def actuators(user: User = Depends(current_user)):
    return actuators_schema(db_client.actuators.find())


# Ruta para obtener un Actuador
@router.get("/{id}")  # Path
async def actuator(id: str, current_user: User = Depends(current_user)):

    return search_actuator("_id", ObjectId(id))


# Ruta para crear un Actuador
@router.post("/", response_model=Actuator, status_code=status.HTTP_201_CREATED)
async def actuator(actuator: Actuator, current_user: User = Depends(current_user)):

    if type(search_actuator("actuator_code", actuator.actuator_code)) == Actuator:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ya existe un actuador con ese código",
        )

    actuator_dict = dict(actuator)
    del actuator_dict["id"]

    # Crear el Actuador en la BD y obtener el ID
    id = db_client.actuators.insert_one(actuator_dict).inserted_id

    # Buscar el Actuador creado y devolverlo
    new_actuator = actuator_schema(db_client.actuators.find_one({"_id": id}))

    return Actuator(**new_actuator)


# Ruta para actualizar un Actuador
@router.put("/", response_model=Actuator)
async def actuator(actuator: Actuator, current_user: User = Depends(current_user)):

    actuator_dict = dict(actuator)
    del actuator_dict["id"]

    try:
        db_client.actuators.find_one_and_replace({"_id": ObjectId(actuator.id)}, actuator_dict)
    except:
        return {"error": "No se ha actualizado el actuador"}

    return search_actuator("_id", ObjectId(actuator.id))


# Ruta para eliminar un Actuador
@router.delete("/{id}")
async def actuator(id: str, current_user: User = Depends(current_user)):

    found = db_client.actuators.find_one_and_delete({"_id": ObjectId(id)})
    if found == None:
        return {"error": "No se ha encontrado el actuador"}
    else:
        return {"mensaje": "Actuador eliminado"}
