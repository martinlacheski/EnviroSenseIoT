from datetime import datetime, timezone
from beanie import Document, Link, PydanticObjectId
from typing import Optional
from models.environment import Environment
from models.nutrient_type import NutrientType
from models.user import User

# ConsumptionSensorLog Model
class ConsumptionSensorLog(Document):
    id: Optional[PydanticObjectId] = None
    environment: Link[Environment]
    description: str
    sensor_code: str
    min_voltage_alert: float
    max_voltage_alert: float
    nutrient_1_enabled: bool
    nutrient_1_type: Link[NutrientType]
    nutrient_1_alert: int
    nutrient_2_enabled: bool
    nutrient_2_type: Link[NutrientType]
    nutrient_2_alert: int
    nutrient_3_enabled: bool
    nutrient_3_type: Link[NutrientType]
    nutrient_3_alert: int
    nutrient_4_enabled: bool
    nutrient_4_type: Link[NutrientType]
    nutrient_4_alert: int
    nutrient_5_enabled: bool
    nutrient_5_type: Link[NutrientType]
    nutrient_5_alert: int
    nutrient_6_enabled: bool
    nutrient_6_type: Link[NutrientType]
    nutrient_6_alert: int
    seconds_to_report: int
    enabled: bool
    user: Link[User]
    operation: str
    timestamp: datetime = datetime.now(timezone.utc)
    
    class Settings:
        collection_name = "consumption_sensors_log"
