from beanie import Document, PydanticObjectId
from typing import Optional


# Role Model
class Role(Document):
    id: Optional[PydanticObjectId] = None
    name: str
    is_admin: bool
