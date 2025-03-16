from beanie import Document, Link, PydanticObjectId
from typing import Optional

from models.country import Country


# Province Model
class Province(Document):
    id: Optional[PydanticObjectId] = None
    country: Link[Country]
    name: str

    class Settings:
        collection_name = "provinces"