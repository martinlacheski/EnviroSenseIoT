from datetime import datetime, timezone
from beanie import Document, PydanticObjectId
from typing import Optional


# SensorConsumptionData Model
class ConsumptionSensorData(Document):
    id: Optional[PydanticObjectId] = None
    sensor_code: str
    voltage: Optional[float]
    current: Optional[float]
    power: Optional[float]
    energy: Optional[float]
    frecuency: Optional[float]
    power_factor: Optional[float]
    nutrient_1_level: Optional[float]
    nutrient_2_level: Optional[float]
    nutrient_3_level: Optional[float]
    nutrient_4_level: Optional[float]
    nutrient_5_level: Optional[float]
    nutrient_6_level: Optional[float]
    datetime: Optional[datetime]
    # timestamp: datetime = datetime.now(timezone.utc)
    

    class Settings:
        collection_name = "consumption_sensors_data"
