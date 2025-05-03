from datetime import datetime
from math import ceil
from typing import Optional, Union
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status, Query
from models.actuator import Actuator
from pydantic import BaseModel

# Importamos Modelo y Esquema de la Entidad
from models.user import User
from models.actuator_data import ActuatorData

# Importamos metodo de autenticación JWT
from utils.authentication import current_user
from utils.pagination import AGGREGATION_OPTIONS, DEFAULT_AGGREGATION, PaginatedResponse, determine_aggregation

# Definimos el prefijo y una respuesta si no existe.
router = APIRouter(
    prefix="/actuators/data",
    tags=["actuators data"],  # TAG para la documentación. Agrupar por Router
    responses={404: {"mensaje": "No encontrado"}},
)


# Ruta para obtener todos los datos de los actuadores
# @router.get("/", response_model=List[ActuatorData])
# async def get_actuator_data(user: User = Depends(current_user)):
#     return await ActuatorData.find().to_list()

class AggregatedActuatorData(BaseModel):
    datetime: datetime
    relay_water_count: int
    relay_water_time: int
    relay_light_count: int
    relay_light_time: int
    relay_aerator_count: int
    relay_aerator_time: int
    relay_vent_count: int
    relay_vent_time: int
    relay_ph_plus_count: int
    relay_ph_plus_time: int
    relay_ph_minus_count: int
    relay_ph_minus_time: int
    relay_nutri_1_count: int
    relay_nutri_1_time: int
    relay_nutri_2_count: int
    relay_nutri_2_time: int
    relay_nutri_3_count: int
    relay_nutri_3_time: int
    relay_nutri_4_count: int
    relay_nutri_4_time: int
    samples: int

@router.get("/", response_model=PaginatedResponse[Union[ActuatorData, AggregatedActuatorData]])
async def get_actuator_data(
    actuator_code: Optional[str] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    aggregation: Optional[str] = Query(None, description="Aggregation: 1m, 5m, 15m, 30m, 1h, 2h"),
    page: int = Query(1, ge=1),
    limit: int = Query(100, ge=1, le=1000),
    user: User = Depends(current_user)):
    
    # Inicializar la consulta
    query = {}
    
    # Filtrar por código de actuador
    if actuator_code:
        query["actuator_code"] = actuator_code
        
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

        # Inicializar la consulta de Match
        match_stage = {"$match": query} if query else {}
        # Crear la etapa de proyección
        project_stage = {
            "$project": {
                "datetime": 1,
                "actuator_code": 1,
                "relay_states": {
                    "relay_water": "$relay_water",
                    "relay_light": "$relay_light",
                    "relay_aerator": "$relay_aerator",
                    "relay_vent": "$relay_vent",
                    "relay_ph_plus": "$relay_ph_plus",
                    "relay_ph_minus": "$relay_ph_minus",
                    "relay_nutri_1": "$relay_nutri_1",
                    "relay_nutri_2": "$relay_nutri_2",
                    "relay_nutri_3": "$relay_nutri_3",
                    "relay_nutri_4": "$relay_nutri_4",
                },
                "bin": {
                    "$dateTrunc": {
                        "date": "$datetime",
                        "unit": unit,
                        "binSize": bin_size
                    }
                }
            }
        }

        # Inicializar la consulta de agregación
        pipeline = []
        
        # Agregar la etapa de coincidencia si hay un filtro
        if match_stage:
            pipeline.append(match_stage)
        # Agregar la etapa de agregación y ordenación
        pipeline.append(project_stage)
        pipeline.append({"$sort": {"datetime": 1}})
        # Agregar los datos y los resultados
        results = await ActuatorData.aggregate(pipeline).to_list(None)

        # Agrupar por bin
        grouped = {}
        for r in results:
            bin_time = r["bin"]
            if bin_time not in grouped:
                grouped[bin_time] = []
            grouped[bin_time].append({"datetime": r["datetime"], **r["relay_states"]})
            
        # Calcular la cantidad de activaciones por cada relay
        def compute_relay_activation_count(events: list[dict], relay_key: str):
            count = 0
            last_state = None
            for event in events:
                current_state = event.get(relay_key)
                if current_state is True and last_state is not True:
                    count += 1
                last_state = current_state
            return count

        # Determinar el tiempo de activación por cada relay
        def compute_activation_time(relay_events: list[dict], relay_key: str):
            total_time = 0
            last_on = None
            for event in relay_events:
                if event.get(relay_key) is True:
                    if last_on is None:
                        last_on = event["datetime"]
                elif event.get(relay_key) is False:
                    if last_on is not None:
                        total_time += (event["datetime"] - last_on).total_seconds()
                        last_on = None
            return total_time

        # Procesar los datos agrupados
        final_data = []
        # Recorrer cada grupo de eventos
        for bin_time, events in grouped.items():
            relay_data = {}
            for relay in [
                "relay_water", "relay_light", "relay_aerator", "relay_vent",
                "relay_ph_plus", "relay_ph_minus", "relay_nutri_1",
                "relay_nutri_2", "relay_nutri_3", "relay_nutri_4"
            ]:
                # Calcular la cantidad de activaciones y el tiempo de activación
                relay_data[f"{relay}_count"] = compute_relay_activation_count(events, relay)
                relay_data[f"{relay}_time"] = compute_activation_time(events, relay)
            # Agregar la fecha y la cantidad de muestras
            relay_data["datetime"] = bin_time
            relay_data["samples"] = len(events)
            final_data.append(relay_data)
        # Calcular el total de muestras
        total_count = len(final_data)
        # Calcular la paginación
        paginated_data = final_data[(page - 1) * limit : page * limit]
        # Retornar los resultados
        return {
            # Retornar los datos agregados
            "data": paginated_data,
            # Retornar la paginación
            "pagination": {
                "aggregation": aggregation,
                "total": total_count,
                "page": page,
                "pages": ceil(total_count / limit),
                "limit": limit
            }
        }

    # Si no hay agregación, devolver los datos originales
    total = await ActuatorData.find(query).count()
    data = await ActuatorData.find(query).sort("-datetime").skip((page - 1) * limit).limit(limit).to_list()
    # Retornar los resultados
    return {
        # Retornar los datos
        "data": data,
        # Retornar la paginación
        "pagination": {
            "aggregation": aggregation,
            "total": total,
            "page": page,
            "pages": ceil(total / limit),
            "limit": limit
        }
    }


# Ruta para obtener un Dato de un Actuador
@router.get("/{id}", response_model=ActuatorData)
async def get_actuator_data(id: PydanticObjectId, user: User = Depends(current_user)):
    data = await ActuatorData.get(id)
    if not data:
        raise HTTPException(status_code=404, detail="Dato de actuador no encontrado")
    return data


# Ruta para crear un Dato de un Actuador
@router.post("/", response_model=ActuatorData, status_code=status.HTTP_201_CREATED)
async def create_actuator_data(actuator_data: ActuatorData):
    await actuator_data.insert()
    return actuator_data
