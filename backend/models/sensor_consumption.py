from beanie import Document, Link, PydanticObjectId
from typing import Optional

from models.environment import Environment
from models.nutrient_type import NutrientType


# ConsumptionSensor Model
class ConsumptionSensor(Document):
    id: Optional[PydanticObjectId] = None
    environment: Link[Environment]
    description: str
    sensor_code: str
    min_voltage_alert: float
    max_voltage_alert: float
    solution_level_alert: int
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
    minutes_to_report: int
    enabled: bool
    
    class Settings:
        collection_name = "consumption_sensors"
