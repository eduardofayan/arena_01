# Arena01

Site institucional e plataforma de franquia da rede Arena01 — Arenas de Futevôlei.

## Visão geral

Este projeto entrega uma solução moderna com:
- Frontend em React + Vite + TailwindCSS + Framer Motion
- Backend em FastAPI + SQLAlchemy + Python
- Banco pronto para SQLite em desenvolvimento e PostgreSQL em produção
- Área administrativa protegida por login JWT
- Formulário de captação por unidade
- Loja virtual com catálogo e carrinho
- Estrutura pronta para deploy em Vercel + Render/Railway

## Stack

- Frontend: React, Vite, TailwindCSS, Framer Motion
- Backend: FastAPI, SQLAlchemy, Pydantic
- Banco: SQLite (dev) / PostgreSQL (prod)
- Email: SMTP configurável
- Pagamentos: Stripe / PagSeguro (estrutura pronta)
- Deploy: Vercel + Render/Railway

## Estrutura do projeto

```text
arena01/
├── backend/
│   ├── app/
│   ├── .env.example
│   ├── requirements.txt
│   └── arena01.db (gerado localmente)
├── frontend/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── ...
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
└── ...
```

## Requisitos

- Node.js 20+
- Python 3.11+
- PostgreSQL 15+ (opcional em produção)
- Conta de e-mail SMTP
- Stripe/PagSeguro (opcional para checkout em produção)

## Configuração local

### 1) Clonar o repositório

```bash
git clone <repo-url>
c d arena01
```

### 2) Instalar dependências do backend

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/macOS
source .venv/bin/activate
pip install -r requirements.txt
```

### 3) Configurar variáveis de ambiente

Crie o arquivo `.env` usando o exemplo:

```bash
copy .env.example .env
```

No diretório `backend`:

```bash
copy .env.example .env
```

No diretório `frontend`:

```bash
copy .env.example .env
```

### 4) Iniciar o backend

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

A API ficará disponível em:
- http://localhost:8000
- Swagger: http://localhost:8000/docs

### 5) Instalar dependências do frontend

```bash
cd frontend
npm install
```

### 6) Iniciar o frontend

```bash
npm run dev
```

A aplicação estará em:
- http://localhost:5173

## Variáveis de ambiente

### Backend

```env
APP_NAME=Arena01
APP_ENV=development
SECRET_KEY=sua-chave-super-secreta
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=120
DATABASE_URL=sqlite:///./arena01.db
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=viniciusfayan@gmail.com
SMTP_PASSWORD=sua-senha-de-app
SMTP_FROM=viniciusfayan@gmail.com
MANAGER_EMAIL=viniciusfayan@gmail.com
ADMIN_EMAIL=viniciusfayan@gmail.com
ADMIN_PASSWORD=Arena01@2026
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
PAGSEGURO_TOKEN=seu-token
```

> Em produção, troque o `DATABASE_URL` para PostgreSQL, por exemplo: `postgresql+psycopg2://postgres:senha@host:5432/arena01`

### Frontend

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Arena01
```

## Área administrativa

Acesse:
- http://localhost:5173/admin

Credenciais demo:
- E-mail: viniciusfayan@gmail.com
- Senha: Arena01@2026

> Em produção, altere a senha e mantenha as credenciais em secret manager ou variáveis do ambiente.

## Fluxo do sistema

### 1) Captação de leads

- Usuário entra na home
- Seleciona a unidade desejada
- Preenche nome, telefone, e-mail e mensagem
- O backend registra o lead e dispara e-mail para a gestão e para a arena selecionada

### 2) Loja virtual

- O catálogo lista produtos do banco
- O usuário adiciona itens ao carrinho
- A tela simula checkout e subtotal
- Integração com Stripe/PagSeguro pode ser habilitada em produção

### 3) Administração

- Gestora acessa painel privado
- Visualiza leads captados
- Consulta número de unidades e produtos
- A estrutura é extensível para CRUD completo

## Deploy em produção

### Frontend — Vercel

1. Conecte o repositório ao Vercel
2. Defina a pasta de build como `frontend`
3. Configure `VITE_API_URL` com a URL do backend em produção
4. Faça o deploy por GitHub

### Backend — Render ou Railway

1. Crie um serviço usando a pasta `backend`
2. Defina o ambiente Python
3. Configure o `DATABASE_URL` para PostgreSQL
4. Configure SMTP, Stripe, e outros secrets
5. Defina `SECRET_KEY` e `ADMIN_PASSWORD` fortes
6. Publique a API

## Banco de dados

### Desenvolvimento local

O projeto usa SQLite por padrão, então não exige PostgreSQL local.

### Produção

Para produção, use PostgreSQL e configure:

```env
DATABASE_URL=postgresql+psycopg2://postgres:senha@host:5432/arena01
```

## Observações finais

- Ative HTTPS em produção
- Configure domínio principal para a Arena01
- Mantenha `SECRET_KEY` fora do código
- Use SMTP real e credenciais de app
- Ajuste CORS para o domínio do frontend em produção

## Licença

Projeto de referência para a marca Arena01.

## Autor

Desenvolvido como base arquitetural para a rede Arena01.
