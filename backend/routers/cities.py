from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.city import City
from schemas.city import city_schema, cities_schema

# Importamos cliente DB
from config import db_client

# Importamos utilidades
from services.cities import search_city

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/cities",
    tags=["cities"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos las Ciudades
@router.get("/")
async def cities(user: User = Depends(current_user)):
    return cities_schema(db_client.cities.find())


# Ruta para obtener una Ciudad
@router.get("/{id}")  # Path
async def city(id: str, user: User = Depends(current_user)):

    return search_city("_id", ObjectId(id))


# Ruta para crear una Ciudad
@router.post("/", response_model=City, status_code=status.HTTP_201_CREATED)
async def city(city: City, current_user: User = Depends(current_user)):

    if type(search_city("name", city.name)) == City:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ya existe una ciudad con ese nombre",
        )

    city_dict = dict(city)
    del city_dict["id"]

    # Crear la Ciudad en la BD y obtener el ID
    id = db_client.cities.insert_one(city_dict).inserted_id

    # Buscar la Ciudad creada y devolverla
    new_city = city_schema(db_client.cities.find_one({"_id": id}))

    return City(**new_city)


# Ruta para actualizar una Ciudad
@router.put("/", response_model=City)
async def city(city: City, current_user: User = Depends(current_user)):

    city_dict = dict(city)
    del city_dict["id"]

    try:
        db_client.cities.find_one_and_replace({"_id": ObjectId(city.id)}, city_dict)
    except:
        return {"error": "No se ha actualizado la ciudad"}

    return search_city("_id", ObjectId(city.id))


# Ruta para eliminar una Ciudad
@router.delete("/{id}")
async def city(id: str, current_user: User = Depends(current_user)):

    found = db_client.cities.find_one_and_delete({"_id": ObjectId(id)})
    if found == None:
        return {"error": "No se ha encontrado la ciudad"}
    else:
        return {"mensaje": "Ciudad eliminada"}
