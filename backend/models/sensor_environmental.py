from beanie import Document, Link, PydanticObjectId
from typing import Optional

from models.environment import Environment


# EnvironmentalSensor Model
class EnvironmentalSensor(Document):
    id: Optional[PydanticObjectId] = None
    environment: Link[Environment]
    description: str
    sensor_code: str
    temperature_alert_min: float
    temperature_alert_max: float
    humidity_alert_min: float
    humidity_alert_max: float
    atmospheric_pressure_alert_min: float
    atmospheric_pressure_alert_max: float
    co2_alert_min: float
    co2_alert_max: float
    seconds_to_report: int
    enabled: bool

    class Settings:
        collection_name = "environmental_sensors"