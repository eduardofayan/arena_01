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


class HomeContentBase(BaseModel):
    badge: str = "Seu lugar preferido"
    title: str = "Arena01 é o seu lugar preferido para praticar futevôlei, beach tennis e vôlei."
    description: str = "Sua experiência premium em Jundiaí, Itatiba e Campinas, com energia, comunidade e alto nível em cada modalidade."
    cta_primary: str = "Agendar visita"
    cta_secondary: str = "Ver loja"
    section_title: str = "Uma marca premium desenhada para a cultura esportiva local"
    section_description: str = "Com tecnologia, conforto e identidade forte, a Arena01 nasceu para conectar pessoas, competição e comunidade em cada unidade."


class HomeContentCreate(HomeContentBase):
    pass


class HomeContentOut(HomeContentBase):
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
