from typing import Optional
from pydantic import BaseModel, Field

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str = "user"
    user_id: int
    full_name: str
    email_or_phone: str
    age: Optional[int] = None
    gender: Optional[str] = None
    social_category: Optional[str] = None
    education_level: Optional[str] = None
    address: Optional[str] = None

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = "user"

class UserLogin(BaseModel):
    email_or_phone: str = Field(..., description="Phone number or email address")
    password: Optional[str] = Field("demo1234", description="Password (defaults to demo password for SIH rapid testing)")

class UserRegister(BaseModel):
    email_or_phone: str
    full_name: str
    password: Optional[str] = "demo1234"
    role: Optional[str] = "user"
    gender: Optional[str] = None
    address: Optional[str] = None
    age: Optional[int] = None
    social_category: Optional[str] = None
    education_level: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email_or_phone: str
    full_name: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True
