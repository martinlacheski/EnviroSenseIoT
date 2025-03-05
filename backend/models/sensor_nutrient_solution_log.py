from datetime import datetime, timezone
from pydantic import BaseModel
from typing import Optional


# NutrientSolutionSensorLog Model
class NutrientSolutionSensorLog(BaseModel):
    id: Optional[str] = None
    environment_id: Optional[str]
    description: str
    sensor_code: str
    temperature_alert: float
    tds_alert: float
    ph_alert: float
    ce_alert: float
    minutes_to_report: int
    enabled: bool
    user_id: Optional[str] = None
    timestamp: datetime = datetime.now(timezone.utc)
