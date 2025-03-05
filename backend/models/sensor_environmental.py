from pydantic import BaseModel
from typing import Optional


# EnvironmentalSensor Model
class EnvironmentalSensor(BaseModel):
    id: Optional[str] = None
    environment_id: Optional[str]
    description: str
    sensor_code: str
    temperature_alert: float
    humidity_alert: float
    atmospheric_pressure_alert: float
    co2_alert: float
    minutes_to_report: int
    enabled: bool
