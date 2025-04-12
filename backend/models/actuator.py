from beanie import Document, Link, PydanticObjectId
from typing import Optional

from models.environment import Environment


# Actuator Model
class Actuator(Document):
    id: Optional[PydanticObjectId] = None
    environment: Link[Environment]
    description: str
    actuator_code: str
    relay_water_enabled: bool
    relay_water_time: Optional[int]
    relay_aerator_enabled: bool
    relay_aerator_time: Optional[int]
    relay_vent_enabled: bool
    relay_vent_time: Optional[int]
    relay_light_enabled: bool
    relay_light_time: Optional[int]
    relay_ph_plus_enabled: bool
    relay_ph_plus_time: Optional[int]
    relay_ph_minus_enabled: bool
    relay_ph_minus_time: Optional[int]
    relay_nutri_1_enabled: bool
    relay_nutri_1_time: Optional[int]
    relay_nutri_2_enabled: bool
    relay_nutri_2_time: Optional[int]
    relay_nutri_3_enabled: bool
    relay_nutri_3_time: Optional[int]
    relay_nutri_4_enabled: bool
    relay_nutri_4_time: Optional[int]
    seconds_to_report: int
    enabled: bool
    
    class Settings:
        collection_name = "actuators"
