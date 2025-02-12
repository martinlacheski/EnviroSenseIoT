from pydantic import BaseModel
from typing import Optional


# Country Model
class Country(BaseModel):
    id: Optional[str] = None
    name: str
