from pydantic import BaseModel
from typing import Optional


# EnvironmentType Model
class EnvironmentType(BaseModel):
    id: Optional[str] = None
    name: str
