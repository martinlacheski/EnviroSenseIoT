from datetime import datetime, timezone
from pydantic import BaseModel
from typing import Optional


# SensorEnvironmentalData Model
class SensorEnvironmentalData(BaseModel):
    id: Optional[str] = None
    sensor_code: str
    temperature: Optional[str]
    humidity: Optional[str]
    atmospheric_pressure: Optional[str]
    luminosity: Optional[str]
    co2: Optional[str]
    timestamp: datetime = datetime.now(timezone.utc)
