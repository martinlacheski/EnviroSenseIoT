from datetime import datetime, timezone
from beanie import Document, PydanticObjectId
from typing import Optional


# SensorConsumptionData Model
class ConsumptionSensorData(Document):
    id: Optional[PydanticObjectId] = None
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
    

    class Settings:
        collection_name = "consumption_sensors_data"
