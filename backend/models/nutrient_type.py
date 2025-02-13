from pydantic import BaseModel
from typing import Optional


# NutrientType Model
class NutrientType(BaseModel):
    id: Optional[str] = None
    name: str
