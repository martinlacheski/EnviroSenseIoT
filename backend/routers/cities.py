from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status

# Importamos Modelo y Esquema de la Entidad
from models.company import Company
from models.environment import Environment
from models.city import City

# Importamos metodo de autenticación JWT
from models.user import User
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/cities",
    tags=["cities"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todas las Ciudades
@router.get("/", response_model=List[City])
async def get_cities(user: dict = Depends(current_user)):
    return await City.find(fetch_links=True).to_list()


# Ruta para obtener una Ciudad
@router.get("/{id}", response_model=dict)
async def get_city(id: PydanticObjectId, user: User = Depends(current_user)):
    city = await City.get(id, fetch_links=True)
    if not city:
        raise HTTPException(status_code=404, detail="Ciudad no encontrada")
    
    return {
        "id": str(city.id),
        "name": city.name,
        "province": city.province.name,
        "country": city.province.country.name
    }


# Ruta para crear una Ciudad
@router.post("/", response_model=City, status_code=status.HTTP_201_CREATED)
async def create_city(city: City, user: User = Depends(current_user)):
    # Validar si ya existe una ciudad con el mismo nombre en la misma provincia
    existing_city = await City.find_one(
        {"name": city.name, "province": city.province}
    )
    if existing_city:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una ciudad con ese nombre en la misma provincia"
        )

    await city.insert()
    return city


# Ruta para actualizar una Ciudad
@router.put("/", response_model=City)
async def update_city(city: City, user: User = Depends(current_user)):
    # Verifica que el ID esté presente en el cuerpo de la solicitud
    if city.id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El ID de la ciudad es requerido para actualizar"
        )

    # Busca la ciudad existente por ID
    existing_city = await City.get(city.id)
    if not existing_city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ciudad no encontrada"
        )

    # Verifica si ya existe otra ciudad con el mismo nombre en la misma provincia
    duplicate = await City.find_one(
        {"name": city.name, "province": city.province, "_id": {"$ne": city.id}}
    )
    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una ciudad con ese nombre en la misma provincia"
        )

    # Actualiza la ciudad
    await city.replace()
    return city


# Ruta para eliminar una Ciudad
@router.delete("/{id}")
async def delete_city(id: PydanticObjectId, user: User = Depends(current_user)):

    # Verificar si hay Empresa que referencien esta Ciudad
    companies = await Company.find(Company.city.id == id).to_list()

    if companies:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se puede eliminar la ciudad porque está asociada a una empresa"
        )
        
    # Verificar si hay Ambientes que referencien esta Ciudad
    environments = await Environment.find(Environment.city.id == id).to_list()

    if environments:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se puede eliminar la ciudad porque tiene ambientes asociados"
        )

    # Si no hay referencias, eliminar la ciudad
    city = await City.get(id)
    if not city:
        raise HTTPException(status_code=404, detail="Ciudad no encontrada")
    
    # Eliminar la ciudad
    await city.delete()

    # Respuesta exitosa
    return {"message": "Ciudad eliminada correctamente"}
