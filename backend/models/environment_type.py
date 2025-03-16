from beanie import Document, PydanticObjectId
from typing import Optional


# EnvironmentType Model
class EnvironmentType(Document):
    id: Optional[PydanticObjectId] = None
    name: str

    class Settings:
        collection_name = "environment_types"