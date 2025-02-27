from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.country import Country
from schemas.country import country_schema, countries_schema

# Importamos cliente DB
from config import db_client

# Importamos utilidades
from services.countries import search_country

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/countries",
    tags=["countries"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los Paises
@router.get("/")
async def countries(user: User = Depends(current_user)):
    return countries_schema(db_client.countries.find())


# Ruta para obtener un Pais
@router.get("/{id}")  # Path
async def country(id: str, current_user: User = Depends(current_user)):

    return search_country("_id", ObjectId(id))


# Ruta para crear un Pais
@router.post("/", response_model=Country, status_code=status.HTTP_201_CREATED)
async def country(country: Country, current_user: User = Depends(current_user)):

    if type(search_country("name", country.name)) == Country:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ya existe un país con ese nombre",
        )

    country_dict = dict(country)
    del country_dict["id"]

    # Crear el País en la BD y obtener el ID
    id = db_client.countries.insert_one(country_dict).inserted_id

    # Buscar el pais creado y devolverlo
    new_country = country_schema(db_client.countries.find_one({"_id": id}))

    return Country(**new_country)


# Ruta para actualizar un País
@router.put("/", response_model=Country)
async def country(country: Country, current_user: User = Depends(current_user)):
    # Verificar si ya existe un país con el mismo nombre (excluyendo el actual)
    existing_type = db_client.countries.find_one({"name": country.name, "_id": {"$ne": ObjectId(country.id)}})
    if existing_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un país con ese nombre",
        )

    country_dict = dict(country)
    del country_dict["id"]

    try:
        db_client.countries.find_one_and_replace({"_id": ObjectId(country.id)}, country_dict)
    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se ha actualizado el país",
        )

    updated_country = search_country("_id", ObjectId(country.id))
    if not updated_country:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontró el país",
        )

    return updated_country


# Ruta para eliminar un País
@router.delete("/{id}")
async def country(id: str, current_user: User = Depends(current_user)):

    found = db_client.countries.find_one_and_delete({"_id": ObjectId(id)})
    if found == None:
        return {"error": "No se ha encontrado el país"}
    else:
        return {"mensaje": "País eliminado"}
