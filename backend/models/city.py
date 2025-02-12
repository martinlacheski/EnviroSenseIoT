from pydantic import BaseModel
from typing import Optional


# City Model
class City(BaseModel):
    id: Optional[str] = None
    province_id: Optional[str]
    name: str
    postal_code: str
