from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from . import auth
from .auth import create_access_token, get_current_admin
from .config import get_settings
from .database import Base, engine, get_db
from .email_service import send_contact_email
from .models import AdminUser, Arena, HomeContent, Lead, Product
from .schemas import (
    AdminLogin,
    AdminUserOut,
    ArenaCreate,
    ArenaOut,
    HomeContentCreate,
    HomeContentOut,
    LeadCreate,
    LeadOut,
    ProductCreate,
    ProductOut,
    TokenOut,
)

settings = get_settings()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Arena01 API", version="1.0.0")

allowed_origins = [
    settings.frontend_url,
    "http://localhost:5173",
    "http://localhost:4173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin for origin in allowed_origins if origin],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


@app.get("/health")
def health_check():
    return {"status": "ok", "app": settings.app_name}


@app.get("/arenas", response_model=list[ArenaOut])
def list_arenas(db: Session = Depends(get_db)):
    return db.query(Arena).filter(Arena.is_active.is_(True)).all()


@app.get("/products", response_model=list[ProductOut])
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.is_active.is_(True)).all()


@app.get("/home-content", response_model=HomeContentOut)
def get_home_content(db: Session = Depends(get_db)):
    content = db.query(HomeContent).first()
    if not content:
        content = HomeContent()
        db.add(content)
        db.commit()
        db.refresh(content)
    return content


@app.post("/contact", response_model=dict)
def create_contact_lead(payload: LeadCreate, db: Session = Depends(get_db)):
    unit = db.query(Arena).filter(Arena.slug == payload.selected_unit).first()
    if unit is None:
        raise HTTPException(status_code=404, detail="Unidade não encontrada")

    lead = Lead(
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        message=payload.message,
        selected_unit=unit.name,
        arena_id=unit.id,
    )

    db.add(lead)
    db.commit()
    db.refresh(lead)

    send_contact_email(
        name=payload.name,
        email=str(payload.email),
        phone=payload.phone or "",
        message=payload.message or "",
        selected_unit=unit.name,
        unit_email=unit.email,
    )
    return {"success": True, "message": "Lead enviado com sucesso", "lead_id": lead.id}


@app.post("/admin/login", response_model=TokenOut)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_admin(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/admin/me", response_model=AdminUserOut)
def admin_me(current_user: AdminUser = Depends(get_current_admin)):
    return current_user


@app.get("/admin/leads", response_model=list[LeadOut])
def admin_leads(db: Session = Depends(get_db), current_user: AdminUser = Depends(get_current_admin)):
    del current_user
    return db.query(Lead).order_by(Lead.created_at.desc()).all()


@app.get("/admin/products", response_model=list[ProductOut])
def admin_products(db: Session = Depends(get_db), current_user: AdminUser = Depends(get_current_admin)):
    del current_user
    return db.query(Product).order_by(Product.created_at.desc()).all()


@app.post("/admin/products", response_model=ProductOut)
def create_product(payload: ProductCreate, db: Session = Depends(get_db), current_user: AdminUser = Depends(get_current_admin)):
    del current_user
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@app.get("/admin/home-content", response_model=HomeContentOut)
def admin_get_home_content(db: Session = Depends(get_db), current_user: AdminUser = Depends(get_current_admin)):
    del current_user
    content = db.query(HomeContent).first()
    if not content:
        content = HomeContent()
        db.add(content)
        db.commit()
        db.refresh(content)
    return content


@app.post("/admin/home-content", response_model=HomeContentOut)
def update_home_content(payload: HomeContentCreate, db: Session = Depends(get_db), current_user: AdminUser = Depends(get_current_admin)):
    del current_user
    content = db.query(HomeContent).first()
    if not content:
        content = HomeContent()
        db.add(content)

    for field, value in payload.model_dump().items():
        setattr(content, field, value)

    db.commit()
    db.refresh(content)
    return content


@app.get("/admin/arenas", response_model=list[ArenaOut])
def admin_arenas(db: Session = Depends(get_db), current_user: AdminUser = Depends(get_current_admin)):
    del current_user
    return db.query(Arena).order_by(Arena.name).all()


@app.post("/admin/arenas", response_model=ArenaOut)
def create_arena(payload: ArenaCreate, db: Session = Depends(get_db), current_user: AdminUser = Depends(get_current_admin)):
    del current_user
    arena = Arena(**payload.model_dump())
    db.add(arena)
    db.commit()
    db.refresh(arena)
    return arena


@app.get("/")
def root():
    return {"message": "Arena01 API"}


@app.on_event("startup")
def seed_demo_data():
    db = next(get_db())
    if db.query(HomeContent).count() == 0:
        db.add(
            HomeContent(
                badge="Seu lugar preferido",
                title="Arena01 é o seu lugar preferido para praticar futevôlei, beach tennis e vôlei.",
                description="Sua experiência premium em Jundiaí, Itatiba e Campinas, com energia, comunidade e alto nível em cada modalidade.",
                cta_primary="Agendar visita",
                cta_secondary="Ver loja",
                section_title="Uma marca premium desenhada para a cultura esportiva local",
                section_description="Com tecnologia, conforto e identidade forte, a Arena01 nasceu para conectar pessoas, competição e comunidade em cada unidade.",
            )
        )

    if db.query(Arena).count() == 0:
        arenas = [
            Arena(
                slug="jundiai",
                name="Arena01 Jundiaí",
                city="Jundiaí",
                neighborhood="Centro",
                email="jundiai@arena01.com.br",
                phone="(11) 4002-0000",
                manager_name="Diana Azevedo",
                description="A primeira unidade da Arena01 reúne um ambiente premium para jogos competitivos e sociais com design pensado para performance e conforto.",
                highlights="Clube premium, quadras profissionais, lounge, aulas de futevôlei e eventos corporativos.",
            ),
            Arena(
                slug="itatiba",
                name="Arena01 Itatiba",
                city="Itatiba",
                neighborhood="Vila Nova",
                email="itatiba@arena01.com.br",
                phone="(11) 4002-1111",
                manager_name="Marina Costa",
                description="Com atmosfera acolhedora e infraestrutura premium, a Arena01 Itatiba é referência em convivência, esporte e comunidade.",
                highlights="Treinos em grupo, espaço kids, quadras cobertas e atendimento premium.",
            ),
            Arena(
                slug="campinas",
                name="Arena01 Campinas",
                city="Campinas",
                neighborhood="Barão Geraldo",
                email="campinas@arena01.com.br",
                phone="(19) 4002-2222",
                manager_name="Lívia Rodrigues",
                description="A unidade de Campinas combina tecnologia, funcionalidade e experiências de alto nível para jogadores, empresas e eventos.",
                highlights="Eventos, competições, estrutura esportiva moderna e convívio premium.",
            ),
        ]
        db.add_all(arenas)

    if db.query(Product).count() == 0:
        products = [
            Product(
                name="Bola Oficial Arena01",
                description="Bola profissional para treino e partidas de alto nível.",
                price=79.9,
                category="Equipamentos",
                image_url="https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&w=900&q=80",
                stock=30,
            ),
            Product(
                name="Camiseta de Treino",
                description="Camiseta leve e respirável para uso diário no esporte.",
                price=129.9,
                category="Roupas",
                image_url="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
                stock=50,
            ),
            Product(
                name="Kit de Acessórios Premium",
                description="Estojo com toalha, garrafa e itens essenciais de treino.",
                price=189.9,
                category="Acessórios",
                image_url="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
                stock=20,
            ),
        ]
        db.add_all(products)

    configured_email = settings.admin_email.lower()
    admin_user = db.query(AdminUser).filter(AdminUser.email == configured_email).first()
    if admin_user is None:
        legacy_admin = db.query(AdminUser).order_by(AdminUser.id.asc()).first()
        if legacy_admin is not None:
            legacy_admin.email = configured_email
            legacy_admin.password_hash = auth.get_password_hash(settings.admin_password)
            legacy_admin.full_name = "Gestora Arena01"
            legacy_admin.is_active = True
        else:
            admin = AdminUser(
                email=configured_email,
                password_hash=auth.get_password_hash(settings.admin_password),
                full_name="Gestora Arena01",
            )
            db.add(admin)
    else:
        admin_user.password_hash = auth.get_password_hash(settings.admin_password)
        admin_user.full_name = "Gestora Arena01"
        admin_user.is_active = True

    db.commit()
    db.close()
