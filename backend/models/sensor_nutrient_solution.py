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
    temperature_alert_min: float
    temperature_alert_max: float
    tds_alert_min: float
    tds_alert_max: float
    ph_alert_min: float
    ph_alert_max: float
    ce_alert_min: float
    ce_alert_max: float
    seconds_to_report: int
    enabled: bool
        
    class Settings:
        collection_name = "nutrient_solution_sensors"
