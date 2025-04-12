from datetime import datetime, timezone
from beanie import Document, Link, PydanticObjectId
from pydantic import BaseModel
from typing import Optional

from models.environment import Environment
from models.user import User


# NutrientSolutionSensorLog Model
class NutrientSolutionSensorLog(Document):
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
    user: Link[User]
    operation: str
    timestamp: datetime = datetime.now(timezone.utc)
    
    class Settings:
        collection_name = "nutrient_solution_sensors_log"
