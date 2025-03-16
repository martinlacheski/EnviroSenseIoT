from datetime import datetime, timezone
from beanie import Document, PydanticObjectId
from typing import Optional


# SensorEnvironmentalData Model
class EnvironmentalSensorData(Document):
    id: Optional[PydanticObjectId] = None
    sensor_code: str
    temperature: Optional[str]
    humidity: Optional[str]
    atmospheric_pressure: Optional[str]
    luminosity: Optional[str]
    co2: Optional[str]
    timestamp: datetime = datetime.now(timezone.utc)
    
    class Settings:
        collection_name = "environmental_sensors_data"
