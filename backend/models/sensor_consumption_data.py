from datetime import datetime, timezone
from pydantic import BaseModel
from typing import Optional


# SensorConsumptionData Model
class SensorConsumptionData(BaseModel):
    id: Optional[str] = None
    sensor_code: str
    voltage: Optional[str]
    current: Optional[str]
    power: Optional[str]
    energy: Optional[str]
    frecuency: Optional[str]
    power_factor: Optional[str]
    solution_level: Optional[str]
    nutrient_1_level: Optional[str]
    nutrient_2_level: Optional[str]
    nutrient_3_level: Optional[str]
    nutrient_4_level: Optional[str]
    nutrient_5_level: Optional[str]
    nutrient_6_level: Optional[str]
    timestamp: datetime = datetime.now(timezone.utc)
