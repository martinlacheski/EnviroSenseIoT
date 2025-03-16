from beanie import Document, PydanticObjectId
from typing import Optional


class Country(Document):
    id: Optional[PydanticObjectId] = None
    name: str

    class Settings:
        collection_name = "countries"
