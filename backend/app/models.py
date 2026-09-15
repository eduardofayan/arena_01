from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


class Arena(Base):
    __tablename__ = "arenas"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(120), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    city = Column(String(120), nullable=False)
    neighborhood = Column(String(160), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(40), nullable=True)
    manager_name = Column(String(160), nullable=True)
    description = Column(Text, nullable=False)
    highlights = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    leads = relationship("Lead", back_populates="arena")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    category = Column(String(120), nullable=False, default="Geral")
    image_url = Column(String(500), nullable=True)
    stock = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class HomeContent(Base):
    __tablename__ = "home_content"

    id = Column(Integer, primary_key=True, index=True)
    badge = Column(String(120), nullable=False, default="Seu lugar preferido")
    title = Column(Text, nullable=False, default="Arena01 é o seu lugar preferido para praticar futevôlei, beach tennis e vôlei.")
    description = Column(Text, nullable=False, default="Sua experiência premium em Jundiaí, Itatiba e Campinas, com energia, comunidade e alto nível em cada modalidade.")
    cta_primary = Column(String(120), nullable=False, default="Agendar visita")
    cta_secondary = Column(String(120), nullable=False, default="Ver loja")
    section_title = Column(Text, nullable=False, default="Uma marca premium desenhada para a cultura esportiva local")
    section_description = Column(Text, nullable=False, default="Com tecnologia, conforto e identidade forte, a Arena01 nasceu para conectar pessoas, competição e comunidade em cada unidade.")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(180), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(40), nullable=True)
    message = Column(Text, nullable=True)
    selected_unit = Column(String(120), nullable=False)
    arena_id = Column(Integer, ForeignKey("arenas.id"), nullable=True)
    status = Column(String(80), default="novo")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    arena = relationship("Arena", back_populates="leads")


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(180), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
