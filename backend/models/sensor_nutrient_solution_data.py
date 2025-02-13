from datetime import datetime, timezone
from pydantic import BaseModel
from typing import Optional


# SensorNutrientSolutionData Model
class SensorNutrientSolutionData(BaseModel):
    id: Optional[str] = None
    sensor_code: str
    temperature: Optional[str]
    tds: Optional[str]
    ph: Optional[str]
    ce: Optional[str]
    timestamp: datetime = datetime.now(timezone.utc)
