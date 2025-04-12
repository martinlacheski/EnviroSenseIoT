from wsgiref.validate import validator
from beanie import Document, Link, PydanticObjectId
from typing import Optional

from models.environment import Environment


# NutrientSolutionSensor Model
class NutrientSolutionSensor(Document):
    id: Optional[PydanticObjectId] = None
    environment: Link[Environment]
    description: str
    sensor_code: str
    temperature_alert: float
    tds_alert: float
    ph_alert: float
    ce_alert: float
    seconds_to_report: int
    enabled: bool
        
    class Settings:
        collection_name = "nutrient_solution_sensors"
