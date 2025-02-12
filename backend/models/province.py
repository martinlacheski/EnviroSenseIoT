from pydantic import BaseModel
from typing import Optional


# Province Model
class Province(BaseModel):
    id: Optional[str] = None
    country_id: Optional[str]
    name: str
