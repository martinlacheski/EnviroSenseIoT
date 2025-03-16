from beanie import Document, PydanticObjectId
from typing import Optional


# NutrientType Model
class NutrientType(Document):
    id: Optional[PydanticObjectId] = None
    name: str

    class Settings:
        collection_name = "nutrient_types"