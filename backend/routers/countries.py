from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status

# Importamos Modelo y Esquema de la Entidad
from models.province import Province
from models.country import Country

# Importamos metodo de autenticación JWT
from models.user import User
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/countries",
    tags=["countries"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Obtener todos los países
@router.get("/", response_model=List[Country])
async def get_countries(user: dict = Depends(current_user)):
    return await Country.find().to_list()

# Obtener un país por ID
@router.get("/{id}", response_model=Country)
async def get_country(id: PydanticObjectId, user: User = Depends(current_user)):
    country = await Country.get(id)
    if not country:
        raise HTTPException(status_code=404, detail="País no encontrado")
    return country

# Crear un país
@router.post("/", response_model=Country, status_code=status.HTTP_201_CREATED)
async def create_country(country: Country, user: User = Depends(current_user)):
    existing_country = await Country.find_one({"name": country.name})
    if existing_country:
        raise HTTPException(status_code=400, detail="Ya existe un país con ese nombre")
    await country.insert()
    return country

# Actualizar un país
@router.put("/", response_model=Country)
async def update_country(country: Country, user: User = Depends(current_user)):
    # Verifica que el ID esté presente en el cuerpo de la solicitud
    if country.id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El ID del país es requerido para actualizar"
        )

    # Busca el país existente por ID
    existing_country = await Country.get(country.id)
    if not existing_country:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="País no encontrado"
        )

    # Verifica si ya existe otro país con el mismo nombre (excluyendo el actual)
    duplicate = await Country.find_one(
        {"name": country.name, "_id": {"$ne": country.id}}
    )
    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un país con ese nombre"
        )

    # Actualiza el país
    await country.replace()
    return country

# Eliminar un país
@router.delete("/{id}")
async def delete_country(id: PydanticObjectId, user: User = Depends(current_user)):

    # Verificar si hay provincias que referencien este país
    provinces = await Province.find(Province.country.id == id).to_list()

    if provinces:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se puede eliminar el país porque tiene provincias asociadas"
        )

    # Si no hay referencias, eliminar el país
    country = await Country.get(id)
    if not country:
        raise HTTPException(status_code=404, detail="País no encontrado")

    # Eliminar el país
    await country.delete()

    # Respuesta exitosa
    return {"message": "País eliminado correctamente"}
