import datetime
from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.company import Company

# Importamos metodo de autenticación JWT
from utils.authentication import current_user


# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/company",
    tags=["company"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todas las Empresas
@router.get("/", response_model=List[Company])
async def get_companies(user: User = Depends(current_user)):
    return await Company.find(fetch_links=True).to_list()


# Ruta para obtener una Empresa
@router.get("/{id}", response_model=Company)
async def get_company(id: PydanticObjectId, user: User = Depends(current_user)):
    company = await Company.get(id, fetch_links=True)
    if not company:
        raise HTTPException(status_code=404, detail="Empresa no encontrada")
    return company


# Ruta para crear una Empresa
@router.post("/", response_model=Company, status_code=status.HTTP_201_CREATED)
async def create_company(company: Company, user: User = Depends(current_user)):
    # Verificar si ya existe una empresa con el mismo nombre o correo electrónico
    existing_company_by_name = await Company.find_one({"name": company.name})
    if existing_company_by_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una empresa con ese nombre"
        )

    existing_company_by_email = await Company.find_one({"email": company.email})
    if existing_company_by_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una empresa con ese correo electrónico"
        )

    # Insertar la nueva empresa
    await company.insert()
    return company


# Ruta para actualizar una Empresa
@router.put("/", response_model=Company)
async def update_company(company: Company, user: User = Depends(current_user)):
    # Verificar si el ID está presente
    if company.id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El ID de la empresa es requerido para actualizar"
        )

    # Buscar la empresa existente
    existing_company = await Company.get(company.id)
    if not existing_company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Empresa no encontrada"
        )

    # Verificar si ya existe otra empresa con el mismo nombre o correo electrónico (excluyendo la actual)
    duplicate_by_name = await Company.find_one(
        {"name": company.name, "_id": {"$ne": company.id}}
    )
    if duplicate_by_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una empresa con ese nombre"
        )

    duplicate_by_email = await Company.find_one(
        {"email": company.email, "_id": {"$ne": company.id}}
    )
    if duplicate_by_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una empresa con ese correo electrónico"
        )

    # Actualizar la empresa
    await company.replace()
    return company


# Ruta para eliminar una Empresa
@router.delete("/{id}")
async def delete_company(id: PydanticObjectId, user: User = Depends(current_user)):
    # Buscar la empresa
    company = await Company.get(id)
    if not company:
        raise HTTPException(status_code=404, detail="Empresa no encontrada")

    # Eliminar la empresa
    await company.delete()
    return {"message": "Empresa eliminada correctamente"}


@router.post("/uploadLogo")
async def upload_logo(
    file: UploadFile = File(...),
    user: User = Depends(current_user)  # Verificar que el usuario esté autenticado
):
    try:
        # Generar un nombre de archivo único basado en la fecha y hora
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        file_extension = file.filename.split(".")[-1]  # Obtener la extensión del archivo
        unique_filename = f"{timestamp}.{file_extension}"

        # Guardar el archivo en la carpeta "static"
        file_path = f"static/images/{unique_filename}"
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        # Obtener la única compañía de la base de datos
        company = await Company.find_one()  # Asumiendo que solo hay una compañía
        if not company:
            raise HTTPException(
                status_code=404,
                detail="No se encontró ninguna compañía en la base de datos"
            )

        # Actualizar el campo logo de la compañía
        company.logo = f"/static/images/{unique_filename}"
        await company.save()  # Guardar los cambios en la base de datos

        # Devolver la URL del archivo subido
        return {"url": company.logo}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))