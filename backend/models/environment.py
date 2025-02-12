from pydantic import BaseModel
from typing import Optional


# Environment Model
class Environment(BaseModel):
    id: Optional[str] = None
    company_id: Optional[str]
    city_id: Optional[str]
    type_id: Optional[str]
    name: str
    address: str
    gps_location: str
    description: Optional[str] = None