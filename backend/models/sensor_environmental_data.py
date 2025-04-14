from datetime import datetime, timezone
from beanie import Document, PydanticObjectId
from typing import Optional


# SensorEnvironmentalData Model
class EnvironmentalSensorData(Document):
    id: Optional[PydanticObjectId] = None
    sensor_code: str
    temperature: Optional[float]
    humidity: Optional[float]
    atmospheric_pressure: Optional[float]
    luminosity: Optional[float]
    co2: Optional[int]
    datetime: Optional[datetime]
    # timestamp: datetime = datetime.now(timezone.utc)
    
    class Settings:
        collection_name = "environmental_sensors_data"
        indexes = [
            [("datetime", 1)],  # Índice para búsquedas por fecha
            [("sensor_code", 1), ("datetime", 1)]  # Índice compuesto
        ]
