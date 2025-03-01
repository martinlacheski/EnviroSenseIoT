from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.company import Company
from schemas.company import company_schema, companies_schema

# Importamos cliente DB
from config import db_client

# Importamos utilidades
from services.company import search_company

# Importamos metodo de autenticación JWT
from utils.authentication import current_user


# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/company",
    tags=["company"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todas las Empresas
@router.get("/")
async def companies(user: User = Depends(current_user)):
    return companies_schema(db_client.companies.find())


# Ruta para obtener una Empresa
@router.get("/{id}")  # Path
async def company(id: str, user: User = Depends(current_user)):

    return search_company("_id", ObjectId(id))


# Ruta para crear una Empresa
@router.post("/", response_model=Company, status_code=status.HTTP_201_CREATED)
async def company(company: Company, current_user: User = Depends(current_user)):

    if type(search_company("name", company.name)) == Company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ya existe una empresa con ese nombre",
        )
    if type(search_company("email", company.email)) == Company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ya existe una empresa con ese correo electrónico",
        )

    company_dict = dict(company)
    del company_dict["id"]

    # Crear la Empresa en la BD y obtener el ID
    id = db_client.companies.insert_one(company_dict).inserted_id

    # Buscar la Empresa creada y devolverla
    new_company = company_schema(db_client.companies.find_one({"_id": id}))

    return Company(**new_company)


# Ruta para actualizar una Empresa
@router.put("/", response_model=Company)
async def company(company: Company, current_user: User = Depends(current_user)):

    company_dict = dict(company)
    del company_dict["id"]

    try:
        db_client.companies.find_one_and_replace({"_id": ObjectId(company.id)}, company_dict)
    except:
        return {"error": "No se ha actualizado la empresa"}

    return search_company("_id", ObjectId(company.id))


# Ruta para eliminar una Empresa
@router.delete("/{id}")
async def company(id: str, current_user: User = Depends(current_user)):

    found = db_client.companies.find_one_and_delete({"_id": ObjectId(id)})
    if found == None:
        return {"error": "No se ha encontrado la empresa"}
    else:
        return {"mensaje": "Empresa eliminada"}
