from datetime import datetime, timezone
from pydantic import BaseModel
from typing import Optional


# ActuatorLog Model
class ActuatorLog(BaseModel):
    id: Optional[str] = None
    environment_id: Optional[str]
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
    disabled: bool
    user_id: Optional[str] = None
    timestamp: datetime = datetime.now(timezone.utc)
    
    
