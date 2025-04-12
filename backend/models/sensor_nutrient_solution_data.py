from datetime import datetime, timezone
from beanie import Document, PydanticObjectId
from typing import Optional


# SensorNutrientSolutionData Model
class NutrientSolutionSensorData(Document):
    id: Optional[PydanticObjectId] = None
    sensor_code: str
    temperature: Optional[float]
    level: Optional[float]
    tds: Optional[float]
    ph: Optional[float]
    ce: Optional[float]
    datetime: Optional[datetime]
    #   timestamp: datetime = datetime.now(timezone.utc)
    
    class Settings:
        collection_name = "nutrient_solution_sensors_data"
