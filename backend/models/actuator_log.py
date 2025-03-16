from datetime import datetime, timezone
from beanie import Document, Link, PydanticObjectId
from typing import Optional

from models.environment import Environment
from models.user import User


# ActuatorLog Model
class ActuatorLog(Document):
    id: Optional[PydanticObjectId] = None
    environment: Link[Environment]
    description: str
    actuator_code: str
    channel_1_enabled: bool
    channel_1_name: Optional[str]
    channel_1_time: Optional[int]
    channel_2_enabled: bool
    channel_2_name: Optional[str]
    channel_2_time: Optional[int]
    channel_3_enabled: bool
    channel_3_name: Optional[str]
    channel_3_time: Optional[int]
    channel_4_enabled: bool
    channel_4_name: Optional[str]
    channel_4_time: Optional[int]
    channel_5_enabled: bool
    channel_5_name: Optional[str]
    channel_5_time: Optional[int]
    channel_6_enabled: bool
    channel_6_name: Optional[str]
    channel_6_time: Optional[int]
    channel_7_enabled: bool
    channel_7_name: Optional[str]
    channel_7_time: Optional[int]
    channel_8_enabled: bool
    channel_8_name: Optional[str]
    channel_8_time: Optional[int]
    minutes_to_report: int
    enabled: bool
    user: Link[User]
    operation: str
    timestamp: datetime = datetime.now(timezone.utc)
    
    class Settings:
        collection_name = "actuators_log"
    
    
