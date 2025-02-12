from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.province import Province
from schemas.province import province_schema, provinces_schema

# Importamos cliente DB
from config import db_client

# Importamos utilidades
from services.provinces import search_province

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/provinces",
    tags=["provinces"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos las Provincias
@router.get("/")
async def provinces(user: User = Depends(current_user)):
    return provinces_schema(db_client.provinces.find())


# Ruta para obtener una Provincia
@router.get("/{id}")  # Path
async def province(id: str, user: User = Depends(current_user)):

    return search_province("_id", ObjectId(id))


# Ruta para crear una Provincia
@router.post("/", response_model=Province, status_code=status.HTTP_201_CREATED)
async def province(province: Province, current_user: User = Depends(current_user)):

    if type(search_province("name", province.name)) == Province:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ya existe una provincia con ese nombre",
        )

    province_dict = dict(province)
    del province_dict["id"]

    # Crear la Provincia en la BD y obtener el ID
    id = db_client.provinces.insert_one(province_dict).inserted_id

    # Buscar la Provincia creada y devolverla
    new_province = province_schema(db_client.provinces.find_one({"_id": id}))

    return Province(**new_province)


# Ruta para actualizar una Provincia
@router.put("/", response_model=Province)
async def province(province: Province, current_user: User = Depends(current_user)):

    province_dict = dict(province)
    del province_dict["id"]

    try:
        db_client.provinces.find_one_and_replace({"_id": ObjectId(province.id)}, province_dict)
    except:
        return {"error": "No se ha actualizado la provincia"}

    return search_province("_id", ObjectId(province.id))


# Ruta para eliminar una Provincia
@router.delete("/{id}")
async def province(id: str, current_user: User = Depends(current_user)):

    found = db_client.provinces.find_one_and_delete({"_id": ObjectId(id)})
    if found == None:
        return {"error": "No se ha encontrado la provincia"}
    else:
        return {"mensaje": "Provincia eliminada"}
