from pydantic import BaseModel
from typing import Optional


# NutrientSolutionSensor Model
class NutrientSolutionSensor(BaseModel):
    id: Optional[str] = None
    environment_id: Optional[str]
    description: str
    sensor_code: str
    tds_alert: float
    ph_alert: float
    ce_alert: float
    minutes_to_report: int
    disabled: bool
