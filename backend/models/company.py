from pydantic import BaseModel
from typing import Optional


# Company Model
class Company(BaseModel):
    id: Optional[str] = None
    name: str
    address: str
    city_id: Optional[str]
    email: str
    phone: Optional[str] = None
    webpage: Optional[str] = None
    logo: Optional[str] = None