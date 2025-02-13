from datetime import datetime, timezone
from pydantic import BaseModel
from typing import Optional


# ConsumptionSensor Model
class ConsumptionSensorLog (BaseModel):
    id: Optional[str] = None
    environment_id: Optional[str]
    description: str
    sensor_code: str
    min_voltage_alert: float
    max_voltage_alert: float
    solution_level_alert: int
    nutrient_1_enabled: bool
    nutrient_1_type_id: Optional[str]
    nutrient_1_alert: int
    nutrient_2_enabled: bool
    nutrient_2_type_id: Optional[str]
    nutrient_2_alert: int
    nutrient_3_enabled: bool
    nutrient_3_type_id: Optional[str]
    nutrient_3_alert: int
    nutrient_4_enabled: bool
    nutrient_4_type_id: Optional[str]
    nutrient_4_alert: int
    nutrient_5_enabled: bool
    nutrient_5_type_id: Optional[str]
    nutrient_5_alert: int
    nutrient_6_enabled: bool
    nutrient_6_type_id: Optional[str]
    nutrient_6_alert: int
    minutes_to_report: int
    disabled: bool
    user_id: Optional[str] = None
    timestamp: datetime = datetime.now(timezone.utc)
