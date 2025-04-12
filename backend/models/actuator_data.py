from datetime import datetime, timezone
from beanie import Document, PydanticObjectId
from typing import Optional


# ActuatorData Model
class ActuatorData(Document):
    id: Optional[PydanticObjectId] = None
    actuator_code: str
    relay_water: Optional[bool]
    relay_aerator: Optional[bool]
    relay_vent: Optional[bool]
    relay_light: Optional[bool]
    relay_ph_plus: Optional[bool]
    relay_ph_minus: Optional[bool]
    relay_nutri_1: Optional[bool]
    relay_nutri_2: Optional[bool]
    relay_nutri_3: Optional[bool]
    relay_nutri_4: Optional[bool]
    datetime: Optional[datetime]
    #timestamp: datetime = datetime.now(timezone.utc)

    class Settings:
        collection_name = "actuators_data"
