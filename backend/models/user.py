from beanie import Document, PydanticObjectId
from typing import Optional


# USER Model
class User(Document):
    id: Optional[PydanticObjectId] = None
    username: str
    password: str
    name: str
    surname: str
    email: str
    enabled: bool
    is_admin: bool


class UpdateCurrentUser(Document):
    id: Optional[PydanticObjectId] = None
    name: str = None
    surname: str = None


class UpdateCurrentUserPassword(Document):
    id: Optional[PydanticObjectId] = None
    current_password: str = None
    new_password: str = None
    new_password_confirmation: str = None
    
class UpdateUserPassword(Document):
    id: Optional[PydanticObjectId] = None
    new_password: str = None
    new_password_confirmation: str = None
