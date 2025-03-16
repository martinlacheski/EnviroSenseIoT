from beanie import Document, Link, PydanticObjectId
from typing import Optional

from models.environment import Environment


# EnvironmentalSensor Model
class EnvironmentalSensor(Document):
    id: Optional[PydanticObjectId] = None
    environment: Link[Environment]
    description: str
    sensor_code: str
    temperature_alert: float
    humidity_alert: float
    atmospheric_pressure_alert: float
    co2_alert: float
    minutes_to_report: int
    enabled: bool

    class Settings:
        collection_name = "environmental_sensors"