from datetime import datetime, timezone
from pydantic import BaseModel
from typing import Optional


# ActuatorData Model
class ActuatorData(BaseModel):
    id: Optional[str] = None
    actuator_code: str
    channel_1_state: Optional[bool]
    channel_2_state: Optional[bool]
    channel_3_state: Optional[bool]
    channel_4_state: Optional[bool]
    channel_5_state: Optional[bool]
    channel_6_state: Optional[bool]
    channel_7_state: Optional[bool]
    channel_8_state: Optional[bool]
    timestamp: datetime = datetime.now(timezone.utc)
