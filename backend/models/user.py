from pydantic import BaseModel
from typing import Optional


# USER Model
class User(BaseModel):
    id: Optional[str] = None
    username: str
    password: str
    name: str
    surname: str
    email: str
    enabled: bool
    is_admin: bool

class UpdateUser(BaseModel):
    id: Optional[str] = None
    name: str = None
    surname: str = None
    
class UpdateUserPassword(BaseModel):
    id: Optional[str] = None
    current_password: str = None
    new_password: str = None
    new_password_confirmation: str = None