from pydantic import BaseModel
from typing import Optional


# Role Model
class Role(BaseModel):
    id: Optional[str] = None
    name: str
    is_admin: bool
