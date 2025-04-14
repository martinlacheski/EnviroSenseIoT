from datetime import datetime
from math import ceil
from typing import Optional
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status, Query

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.sensor_consumption_data import ConsumptionSensorData


# Importamos metodo de autenticación JWT
from utils.authentication import current_user
from utils.pagination import AGGREGATION_OPTIONS, DEFAULT_AGGREGATION, PaginatedResponse, determine_aggregation

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/sensors/consumption/data",
    tags=["consumption sensors data"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)

# Ruta para obtener todos los datos de Sensores de Consumo
@router.get("/", response_model=PaginatedResponse[ConsumptionSensorData])
async def get_sensor_consumption_data(
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
                "sensor_code": {"$first": "$sensor_code"},
                "voltage": {"$avg": "$voltage"},
                "current": {"$avg": "$current"},
                "power": {"$avg": "$power"},
                "energy": {"$avg": "$energy"},
                "frecuency": {"$avg": "$frecuency"},
                "power_factor": {"$avg": "$power_factor"},
                "nutrient_1_level": {"$avg": "$nutrient_1_level"},
                "nutrient_2_level": {"$avg": "$nutrient_2_level"},
                "nutrient_3_level": {"$avg": "$nutrient_3_level"},
                "nutrient_4_level": {"$avg": "$nutrient_4_level"},
                "nutrient_5_level": {"$avg": "$nutrient_5_level"},
                "nutrient_6_level": {"$avg": "$nutrient_6_level"}
            }
        })
        # Agregar la etapa de ordenación, paginación y límite
        pipeline.append({"$sort": {"_id": -1}})
        pipeline.append({"$skip": (page - 1) * limit})
        pipeline.append({"$limit": limit})
        # Agregar los datos y los resultados
        results = await ConsumptionSensorData.aggregate(pipeline).to_list(None)
        total_pipeline = pipeline[:-2] + [{"$count": "total"}]
        total = await ConsumptionSensorData.aggregate(total_pipeline).to_list()
        total_count = total[0]["total"] if total else 0
        # Retornar los resultados
        return {
            # Retornar los datos agregados
            "data": [
                {
                    "datetime": r["_id"],
                    "sensor_code": r["sensor_code"],
                    "voltage": round(r["voltage"], 2),
                    "current": round(r["current"], 2),
                    "power": round(r["power"], 2),
                    "energy": round(r["energy"], 2),
                    "frecuency": round(r["frecuency"], 2),
                    "power_factor": round(r["power_factor"], 2),
                    "nutrient_1_level": round(r["nutrient_1_level"], 2),
                    "nutrient_2_level": round(r["nutrient_2_level"], 2),
                    "nutrient_3_level": round(r["nutrient_3_level"], 2),
                    "nutrient_4_level": round(r["nutrient_4_level"], 2),
                    "nutrient_5_level": round(r["nutrient_5_level"], 2),
                    "nutrient_6_level": round(r["nutrient_6_level"], 2)
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
    total = await ConsumptionSensorData.find(query).count()
    data = await ConsumptionSensorData.find(query).sort("-datetime").skip((page - 1) * limit).limit(limit).to_list()
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


# Ruta para obtener un Dato de Sensor de consumos
@router.get("/{id}", response_model=ConsumptionSensorData)
async def get_sensor_consumption_data(id: PydanticObjectId, user: User = Depends(current_user)):
    data = await ConsumptionSensorData.get(id)
    if not data:
        raise HTTPException(status_code=404, detail="Dato de sensor de consumos no encontrado")
    return data


# Ruta para crear un Dato de Sensor de consumos
@router.post("/", response_model=ConsumptionSensorData, status_code=status.HTTP_201_CREATED)
async def create_sensor_consumption_data(sensor_data: ConsumptionSensorData):
    await sensor_data.insert()
    return sensor_data
