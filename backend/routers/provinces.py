from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status

# Importamos Modelo y Esquema de la Entidad
from models.city import City
from models.province import Province

# Importamos metodo de autenticación JWT
from models.user import User
from utils.authentication import current_user

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/provinces",
    tags=["provinces"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Obtener todas las provincias con el nombre del país
@router.get("/", response_model=List[Province])
async def get_provinces(user: dict = Depends(current_user)):
    return await Province.find(fetch_links=True).to_list()


# Obtener una provincia por ID
@router.get("/{id}", response_model=dict)
async def get_province(id: PydanticObjectId, user: User = Depends(current_user)):
    province = await Province.get(id, fetch_links=True)
    if not province:
        raise HTTPException(status_code=404, detail="Provincia no encontrada")
    
    return {"id": str(province.id), "name": province.name, "country": province.country.name}

# Crear una provincia
@router.post("/", response_model=Province, status_code=status.HTTP_201_CREATED)
async def create_province(province: Province, user: User = Depends(current_user)):
    # Validar si ya existe una provincia con el mismo nombre en el país
    existing_province = await Province.find_one(
        {"name": province.name, "country": province.country}
    )
    if existing_province:
        raise HTTPException(status_code=400, detail="Ya existe una provincia con ese nombre en el país")

    await province.insert()
    return province

# Actualizar una provincia
@router.put("/", response_model=Province)
async def update_province(province: Province, user: User = Depends(current_user)):
    # Verifica que el ID esté presente en el cuerpo de la solicitud
    if province.id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El ID de la provincia es requerido para actualizar"
        )

    # Busca la provincia existente por ID
    existing_province = await Province.get(province.id)
    if not existing_province:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provincia no encontrada"
        )

    # Verifica si ya existe otra provincia con el mismo nombre en el mismo país
    duplicate = await Province.find_one(
        {"name": province.name, "country": province.country, "_id": {"$ne": province.id}}
    )
    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una provincia con ese nombre en el país"
        )

    # Actualiza la provincia
    await province.replace()
    return province

# Eliminar una provincia
@router.delete("/{id}")
async def delete_province(id: PydanticObjectId, user: User = Depends(current_user)):

    # Verificar si hay ciudades que referencien esta provincia
    cities = await City.find(City.province.id == id).to_list()

    if cities:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se puede eliminar la provincia porque tiene ciudades asociadas"
        )

    # Si no hay referencias, eliminar la provincia
    province = await Province.get(id)
    if not province:
        raise HTTPException(status_code=404, detail="Provincia no encontrada")
    
    # Eliminar la provincia
    await province.delete()

    # Respuesta exitosa
    return {"message": "Provincia eliminada correctamente"}
