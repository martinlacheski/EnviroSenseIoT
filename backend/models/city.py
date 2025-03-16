from beanie import Document, Link, PydanticObjectId
from typing import Optional

from models.province import Province


# City Model
class City(Document):
    id: Optional[PydanticObjectId] = None
    province: Link[Province]
    name: str
    postal_code: str


    class Settings:
        collection_name = "cities"
