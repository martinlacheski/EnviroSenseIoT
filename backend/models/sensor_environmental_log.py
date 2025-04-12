from datetime import datetime, timezone
from beanie import Document, Link, PydanticObjectId
from typing import Optional

from models.environment import Environment
from models.user import User


# EnvironmentalSensorLog Model
class EnvironmentalSensorLog(Document):
    id: Optional[PydanticObjectId] = None
    environment: Link[Environment]
    description: str
    sensor_code: str
    temperature_alert: float
    humidity_alert: float
    atmospheric_pressure_alert: float
    co2_alert: float
    seconds_to_report: int
    enabled: bool
    user: Link[User]
    operation: str
    timestamp: datetime = datetime.now(timezone.utc)
    
    class Settings:
        collection_name = "environmental_sensors_log"
