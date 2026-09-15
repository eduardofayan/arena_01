from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class ArenaBase(BaseModel):
    slug: str
    name: str
    city: str
    neighborhood: str
    email: EmailStr
    phone: Optional[str] = None
    manager_name: Optional[str] = None
    description: str
    highlights: Optional[str] = None
    is_active: bool = True


class ArenaCreate(ArenaBase):
    pass


class ArenaUpdate(ArenaBase):
    pass


class ArenaOut(ArenaBase):
    id: int

    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    category: str = "Geral"
    image_url: Optional[str] = None
    stock: int = 0
    is_active: bool = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ProductBase):
    pass


class ProductOut(ProductBase):
    id: int

    class Config:
        from_attributes = True


class LeadBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: Optional[str] = None
    selected_unit: str


class LeadCreate(LeadBase):
    pass


class LeadOut(LeadBase):
    id: int
    arena_id: Optional[int] = None
    status: str = "novo"

    class Config:
        from_attributes = True


class AdminLogin(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AdminUserOut(BaseModel):
    id: int
    email: str
    full_name: str

    class Config:
        from_attributes = True
