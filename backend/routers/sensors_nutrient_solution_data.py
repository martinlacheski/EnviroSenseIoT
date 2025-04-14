from datetime import datetime
from math import ceil
from typing import Optional
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status, Query

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.sensor_nutrient_solution_data import NutrientSolutionSensorData

# Importamos metodo de autenticación JWT
from utils.authentication import current_user
from utils.pagination import AGGREGATION_OPTIONS, DEFAULT_AGGREGATION, PaginatedResponse, determine_aggregation

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/sensors/nutrients/solution/data",
    tags=[
        "nutrient solution sensors data"
    ],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)

# Ruta para obtener todos los datos de Sensores de Solución de Nutrientes
@router.get("/", response_model=PaginatedResponse[NutrientSolutionSensorData])
async def get_nutrient_solution_sensor_data(
    sensor_code: Optional[str] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    aggregation: Optional[str] = Query(None, description="Aggregation: 1m, 5m, 15m, 30m, 1h, 2h"),
    page: int = Query(1, ge=1),
    limit: int = Query(100, ge=1, le=1000),
    user: User = Depends(current_user)):
    
    # Inicializar la consulta
    query = {}
    
    # Filtrar por código de sensor
    if sensor_code:
        query["sensor_code"] = sensor_code

    # Si se proporciona una fecha de inicio o fin, se agrega a la consulta
    if start_date or end_date:
        query["datetime"] = {}
        if start_date:
            query["datetime"]["$gte"] = start_date
        if end_date:
            query["datetime"]["$lte"] = end_date

    # Determinar unidad y binSize
    # Si no se proporciona una fecha de inicio o fin, se establece un rango predeterminado
    if aggregation or (start_date and end_date):
        if aggregation:
            unit, bin_size = AGGREGATION_OPTIONS.get(aggregation, DEFAULT_AGGREGATION)
        else:
            unit, bin_size = determine_aggregation(start_date, end_date)
        
        # Inicializar la consulta de agregación
        pipeline = []
        # Agregar la etapa de coincidencia si hay un filtro
        if query:
            pipeline.append({"$match": query})
        # Agregar los campos necesarios
        pipeline.append({
            "$group": {
                "_id": {
                    "$dateTrunc": {
                        "date": "$datetime",
                        "unit": unit,
                        "binSize": bin_size
                    }
                },
                "temperature": {"$avg": "$temperature"},
                "level": {"$avg": "$level"},
                "tds": {"$avg": "$tds"},
                "ph": {"$avg": "$ph"},
                "ce": {"$avg": "$ce"},
                "sensor_code": {"$first": "$sensor_code"}
            }
        })
        # Agregar la etapa de ordenación, paginación y límite
        pipeline.append({"$sort": {"_id": -1}})
        pipeline.append({"$skip": (page - 1) * limit})
        pipeline.append({"$limit": limit})
        # Agregar los datos y los resultados
        results = await NutrientSolutionSensorData.aggregate(pipeline).to_list(None)
        total_pipeline = pipeline[:-2] + [{"$count": "total"}]
        total = await NutrientSolutionSensorData.aggregate(total_pipeline).to_list()
        total_count = total[0]["total"] if total else 0
        # Retornar los resultados
        return {
            # Retornar los datos agregados
            "data": [
                {
                    "datetime": r["_id"],
                    "temperature": round(r["temperature"], 2),
                    "level": round(r["level"], 2),
                    "tds": round(r["tds"], 2),
                    "ph": round(r["ph"], 2),
                    "ce": round(r["ce"], 2),
                    "sensor_code": r["sensor_code"]
                } for r in results
            ],
            # Retornar la paginación
            "pagination": {
                "aggregation": aggregation if aggregation else None,
                "total": total_count,
                "page": page,
                "pages": ceil(total_count / limit),
                "limit": limit
            }
        }

    # Si no hay agregación, devolver los datos originales
    total = await NutrientSolutionSensorData.find(query).count()
    data = await NutrientSolutionSensorData.find(query).sort("-datetime").skip((page - 1) * limit).limit(limit).to_list()
    # Retornar los resultados
    return {
        # Retornar los datos
        "data": data,
        # Retornar la paginación
        "pagination": {
            "aggregation": aggregation if aggregation else None,
            "total": total,
            "page": page,
            "pages": ceil(total / limit),
            "limit": limit
        }
    }

# Ruta para obtener un Dato de Sensor de Solucion de Nutrientes
@router.get("/{id}", response_model=NutrientSolutionSensorData)
async def get_nutrient_solution_sensor_data(id: PydanticObjectId, user: User = Depends(current_user)):
    data = await NutrientSolutionSensorData.get(id)
    if not data:
        raise HTTPException(status_code=404, detail="Dato de sensor de solución de nutrientes no encontrado")
    return data


# Ruta para crear un Dato de Sensor de Solucion de Nutrientes
@router.post("/", response_model=NutrientSolutionSensorData, status_code=status.HTTP_201_CREATED)
async def create_nutrient_solution_sensor_data(sensor_data: NutrientSolutionSensorData):
    # Insertar el nuevo dato de sensor de solución de nutrientes
    await sensor_data.insert()
    return sensor_data
