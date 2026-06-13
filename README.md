# Financy

Aplicação de gestão financeira pessoal. Permite que cada usuário gerencie suas **transações** (entradas e saídas) e **categorias**, com autenticação e isolamento de dados por usuário.

O projeto é dividido em dois módulos:

- **`backend/`** — API GraphQL em TypeScript (TypeGraphQL + Apollo Server + Prisma + PostgreSQL).
- **`frontend/`** — SPA em React + Vite consumindo a API via GraphQL.

---

## Funcionalidades

- Autenticação com criação de conta e login (JWT).
- CRUD de categorias (com ícone, cor e descrição opcional).
- CRUD de transações, onde **toda transação pertence a uma categoria**.
- Listagem de transações com **paginação no servidor** e **filtros** (busca por descrição, tipo, categoria e período).
- **Dashboard** com:
  - Resumo do mês (saldo, receitas e despesas).
  - Transações recentes.
  - Total e quantidade de itens por categoria.
- Página de **perfil** para atualizar o nome e sair da conta.
- Validação de expiração de token no cliente, com logout e redirecionamento automático para o login.

---

## Tecnologias

### Backend
- TypeScript + Node.js
- TypeGraphQL (code-first) + Apollo Server v5 + Express 5
- Prisma ORM + PostgreSQL
- JWT (`jsonwebtoken`) e hashing de senha (`bcryptjs`)
- CORS habilitado

### Frontend
- React 19 + Vite
- React Router DOM
- TanStack React Query
- `graphql-request`
- React Hook Form + Zod
- Tailwind CSS + componentes estilo shadcn/ui
- `lucide-react` e `sonner`

---

## Pré-requisitos

- Node.js 20+
- pnpm
- Docker e Docker Compose (para o PostgreSQL)

---

## Como rodar

### 1. Backend

```bash
cd backend

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env e defina um JWT_SECRET

# Suba o banco de dados (PostgreSQL via Docker)
pnpm db:up

# Rode as migrations e gere o Prisma Client
pnpm migrate
pnpm generate

# Inicie o servidor (http://localhost:4000/graphql)
pnpm dev
```

Variáveis de ambiente (`backend/.env`):

| Variável       | Descrição                                  |
| -------------- | ------------------------------------------ |
| `JWT_SECRET`   | Segredo usado para assinar os tokens JWT.  |
| `DATABASE_URL` | String de conexão do PostgreSQL.           |

### 2. Frontend

```bash
cd frontend

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie a aplicação (http://localhost:5173)
pnpm dev
```

Variáveis de ambiente (`frontend/.env`):

| Variável           | Descrição                          |
| ------------------ | ---------------------------------- |
| `VITE_BACKEND_URL` | URL do endpoint GraphQL do backend. |

---

## Scripts úteis

### Backend

| Script            | Descrição                                  |
| ----------------- | ------------------------------------------ |
| `pnpm dev`        | Inicia a API em modo watch.                |
| `pnpm migrate`    | Aplica as migrations (`prisma migrate dev`). |
| `pnpm generate`   | Gera o Prisma Client.                       |
| `pnpm db:up`      | Sobe o PostgreSQL via Docker Compose.       |
| `pnpm db:down`    | Derruba o container do banco.               |

### Frontend

| Script         | Descrição                          |
| -------------- | ---------------------------------- |
| `pnpm dev`     | Inicia o ambiente de desenvolvimento. |
| `pnpm build`   | Gera o build de produção.           |
| `pnpm preview` | Pré-visualiza o build de produção.  |
| `pnpm lint`    | Verificação de tipos (`tsc --noEmit`). |

---

## Estrutura do projeto

```
.
├── backend/
│   ├── prisma/              # Schema, migrations e seed
│   ├── src/
│   │   ├── dtos/            # Inputs e outputs do GraphQL
│   │   ├── graphql/         # Contexto e decorators
│   │   ├── middlewares/     # Middleware de autenticação
│   │   ├── models/          # Object types do TypeGraphQL
│   │   ├── resolvers/       # Resolvers (auth, category, transaction)
│   │   ├── services/        # Regras de negócio
│   │   └── utils/           # JWT, hash e validações
│   └── docker-compose.yml   # PostgreSQL
└── frontend/
    └── src/
        ├── components/      # Componentes de UI e domínio
        ├── contexts/        # Contexto de autenticação
        ├── graphql/         # Operações e tipos
        ├── hooks/           # Hooks de dados (React Query)
        ├── lib/             # Utilitários (jwt, storage, format, etc.)
        └── pages/           # Páginas (login, dashboard, transações, etc.)
```

---

## Modelo de dados

- **User**: usuário da aplicação.
- **Category**: categoria com `name`, `description` (opcional), `icon` e `color` (enums).
- **Transaction**: transação com `title`, `amount`, `type` (`INCOME`/`EXPENSE`), `date` e categoria obrigatória.

Todos os dados são isolados por usuário através do contexto autenticado do GraphQL.
