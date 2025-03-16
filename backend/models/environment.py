from beanie import Document, Link, PydanticObjectId
from typing import Optional

from models.city import City
from models.company import Company
from models.environment_type import EnvironmentType


# Environment Model
class Environment(Document):
    id: Optional[PydanticObjectId] = None
    company: Link[Company]
    city: Link[City]
    type: Link[EnvironmentType]
    name: str
    address: str
    gps_location: str
    description: Optional[str] = None
    
    
    class Settings:
        collection_name = "environments"