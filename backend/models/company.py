from beanie import Document, Link, PydanticObjectId
from typing import Optional

from models.city import City


# Company Model
class Company(Document):
    id: Optional[PydanticObjectId] = None
    name: str
    address: str
    city: Link[City]
    email: str
    phone: Optional[str] = None
    webpage: Optional[str] = None
    logo: Optional[str] = None
    
    class Settings:
        collection_name = "companies"