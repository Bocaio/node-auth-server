# Authentication Boilerplate Server

A robust RESTful API server boilerplate for **Authentication** built with **Express 5**, **TypeScript**, **MySQL**, and **Redis**. 

This project is tailored to help me set up fresh projects blazing fast while learning core concepts. The server uses a clean **layered architecture** with manual dependency injection and an asynchronous event-driven **background worker** layer.

### 💡 Why Plain MySQL and Redis?

> I use **MySQL** (via `mysql2/promise`) and **Redis** (via the standard `redis` client) *plainly* — without leaning on bulky ORMs (like Prisma) or abstract queue libraries (like Bull). The goal is to get my hands dirty, develop a deep understanding of database queries and background job processing under the hood, and maintain fine-grained control over the system's architecture. 

*(Note: I will keep updating this repo as my foundational setup for future projects.)*

---

## Tech Stack

| Category         | Technology                           |
| ---------------- | ------------------------------------ |
| **Runtime**      | Node.js (ESM)                        |
| **Framework**    | Express 5                            |
| **Language**     | TypeScript                           |
| **Database**     | MySQL (via `mysql2/promise`)         |
| **Queue/Workers**| Redis (plain `redis` client)         |
| **Auth**         | JWT (`jsonwebtoken`), bcrypt, Google OAuth (`google-auth-library`) |
| **Dev Tooling**  | `tsx` (watch mode), `tsc`            |

---

## Project Architecture

The application is split between **Main API Server** and **Background Workers**, organized into distinct layers, each with a single responsibility. Dependencies flow strictly **downward** — upper layers depend on lower layers, never the reverse.

```text
┌─────────────────────────────────────────────┐
│                   CLIENT                    │
└──────────────────┬──────────────────────────┘
                   │  HTTP Request
                   ▼
┌─────────────────────────────────────────────┐
│              ROUTES LAYER                   │
│  src/routes/{auth,health}.ts                │
│  Maps URL paths to controller methods       │
│  Attaches route-level middlewares           │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│           MIDDLEWARE LAYER                  │
│  src/middlewares/{auth,csrf,error}.ts       │
│  Cross-cutting concerns (JWT, CSRF)         │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│           CONTROLLER LAYER                  │
│  src/controller/{auth,health}.ts            │
│  Extracts request data, handles response    │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│            SERVICE LAYER                    │
│  src/service/{auth,email}.ts                │
│  Core business logic. Optionally pushes     │
│  background jobs to Redis.                  │
└──────────────────┬──────────────┬───────────┘
                   │              │
                   ▼              ▼
┌─────────────────────────────────────────────┐  ┌─────────────────────────────────────────────┐
│          REPOSITORY LAYER                   │  │           REDIS QUEUE                       │
│  src/repository/{user}.ts                   │  │  src/queue/index.ts                         │
│  Direct database access via SQL queries     │  │  Bare-metal redis connection                │
└──────────────────┬──────────────────────────┘  └────────────────┬────────────────────────────┘
                   │                                              │
                   ▼                                              ▼
┌─────────────────────────────────────────────┐  ┌─────────────────────────────────────────────┐
│          DATABASE LAYER                     │  │         BACKGROUND WORKERS                  │
│  src/database/index.ts                      │  │  src/worker/                                │
│  MySQL connection pool (mysql2/promise)     │  │  Polls Redis for async jobs (e.g. Email)    │
└─────────────────────────────────────────────┘  └─────────────────────────────────────────────┘
```

---

## Layer Details

### 1. Routes (`src/routes/`)

Defines the API endpoints and wires together controllers with middlewares.

| File         | Base Path   | Endpoints                                    | Middlewares Used    |
| ------------ | ----------- | -------------------------------------------- | ------------------- |
| `auth.ts`    | `/auth`     | `POST /create`, `POST /login`, `POST /google`| `verifyCSRFToken` (google only) |
| `health.ts`  | `/health`   | `GET /greet`                                 | `authMiddleware` (route-level) |

### 2. Middlewares (`src/middlewares/`)

| File        | Purpose                                                              |
| ----------- | -------------------------------------------------------------------- |
| `auth.ts`   | Verifies JWT `accessToken` from cookies, attaches `req.user` payload |
| `csrf.ts`   | Validates `g_csrf_token` in cookie and body for Google Sign-In       |
| `error.ts`  | Global error handler — catches `AppError`, MySQL errors, and unknown errors |

### 3. Controllers (`src/controller/`)

Thin layer that extracts data from `req`, calls the appropriate service method, and uses `successHandler` to format the response.

| File         | Class              | Methods                                  |
| ------------ | ------------------ | ---------------------------------------- |
| `auth.ts`    | `UserController`   | `createUser`, `loginUser`, `googleLogin` |
| `health.ts`  | `HealthController` | `greet`                                  |

### 4. Services (`src/service/`)

Contains all business logic. Services receive a **repository** via constructor injection.

| File         | Class          | Responsibilities                                                             |
| ------------ | -------------- | ---------------------------------------------------------------------------- |
| `auth.ts`    | `UserService`  | Registration (bcrypt hash), login (password verify + JWT), Google OAuth login |
| `email.ts`   | `EmailService` | Core email and messaging logic                                               |

### 5. Repositories (`src/repository/`)

Data-access layer. Each repository encapsulates raw SQL queries against the MySQL database.

| File       | Class               | Methods                                        |
| ---------- | ------------------- | ---------------------------------------------- |
| `user.ts`  | `UserRepository`    | `create`, `get`, `createGoogleUser`, `getGoogleUser` |

### 6. Background Jobs & Workers (`src/queue/` & `src/worker/`)

Handles asynchronous tasks.
- **`queue/index.ts`**: Bare-metal Redis client. 
- **`worker/`**: Consumers (like `emailConsumer`) extending a custom generic `BaseConsumer` logic polling Redis lists.
- **`worker-dependency-injection/`**: Dependency injection wiring specific to the isolated worker process.

### 7. Database (`src/database/`)

Exports a **MySQL connection pool** configured for the database with keep-alive and connection limits.

---

## Supporting Modules

### Dependency Injection (`src/dependency-injection/`)

Manually wires repositories into services. Each DI file creates instances and exports the fully-assembled service.

```
dependency-injection/auth.ts    →  UserRepository  → UserService  (exported as userService)
```

### Config (`src/config/`)

Centralizes all environment variables in a single `CONFIGS` object:
- `JWT_SECRET_KEY` — JWT signing secret
- `NODE_ENV` — environment flag (controls secure cookies)
- `GOOGLE_CLIENT_ID` — for Google OAuth verification
- `SMTP_GMAIL` / `SMTP_PASSWORD` — future email sending credentials

### Types (`src/types/`)

| File            | Description                                              |
| --------------- | -------------------------------------------------------- |
| `AppError.ts`   | Custom error class with `statusCode` for operational errors |
| `JwtPayload.ts` | `UserPayload` interface (`userId`, `email`) extending `JwtPayload` |
| `express.d.ts`  | Augments Express `Request` to include `user?: UserPayload` |

### Utils & Emal Templates

- **`src/utils/helper.ts`**: Contains `successHandler` — formats HTTP responses and sets auth cookies based on action type.
- **`src/email-templates/`**: Contains HTML templates designed for sending rich emails (e.g., OTP codes).

---


## Folder Structure

```text
server/
├── sql/
│   ├── init.sql              # Schema definition (7 tables)
│   └── dummy.sql             # Seed data for development
├── src/
│   ├── config/               # Environment variable centralization
│   ├── controller/           # Request handling (thin layer)
│   ├── database/             # MySQL connection pool
│   ├── dependency-injection/ # Manual API DI wiring
│   ├── email-templates/      # Email layouts (e.g. OTP templates)
│   ├── middlewares/          # Auth, CSRF, error handling
│   ├── queue/                # Redis connection setup
│   ├── repository/           # Data access (raw SQL)
│   ├── routes/               # Endpoint definitions
│   ├── service/              # Business logic
│   ├── types/                # TypeScript types & declarations
│   ├── utils/                # Shared helpers
│   ├── worker/               # Background task consumers (Redis)
│   ├── worker-dependency-injection/ # Manual Worker DI wiring
│   ├── index.ts              # API App entry point
│   └── worker.ts             # Worker entry point
├── package.json
└── tsconfig.json
```

---

## Request Flow

A typical authenticated request flows through the layers like this:

```text
Client Request
    │
    ▼
index.ts (Express app)
    │  app.use() applies global middlewares (cors, json, cookieParser)
    ▼
routes/auth.ts
    │  Matches POST /auth/login
    ▼
controller/auth.ts → UserController.loginUser()
    │  Extracts { email, password } from req.body
    ▼
service/auth.ts → UserService.login()
    │  Calls repository.get(email)
    │  Compares password with bcrypt
    │  Signs JWT access + refresh tokens
    │  (If sending email, pushes job to Redis Queue)
    ▼
repository/user.ts → UserRepository.get()
    │  Executes SELECT query on MySQL
    ▼
database/index.ts → pool.execute()
    │  Returns raw rows
    ▼
(Response bubbles back up through each layer)
    │
    ▼
utils/helper.ts → successHandler()
    │  Sets httpOnly cookies & sends JSON response
    ▼
Client receives response
```

Simultaneously, in a separate process, the **Worker** independently continuously polls `src/queue` for async tasks like emails.

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MySQL server running
- Redis server running (defaults to `localhost:6379`)

### Setup

```bash
# Install dependencies
npm install

# Create the database and tables
mysql -u root < sql/init.sql

# (Optional) Seed with dummy data
mysql -u root < sql/dummy.sql
```

Create `.env` file with required variables.
```env
JWT_SECRET_KEY=<your-secret>
NODE_ENV=development
GOOGLE_CLIENT_ID=<your-google-client-id>
GMAIL=<your-gmail>
PASSWORD=<your-app-password>
```

### Run

You will need **two** terminal windows. One for handling the Main RESTful API requests, and one that runs consumers for processing Redis background tasks.

```bash
# Terminal 1: Run the API Server (Development with hot reload)
npm run dev

# Terminal 2: Run the Background Workers (Processes Queue)
npm run dev:worker
```

For Production:
```bash
# Terminal 1
npm run start:prod

# ... ensure your worker runs as a background process using a process manager like PM2
```

The API server starts on **port 8080** by default.

---

## API Endpoints

| Method | Path               | Auth Required | Description                 |
| ------ | ------------------ | ------------- | --------------------------- |
| POST   | `/auth/create`     | No            | Register a new user         |
| POST   | `/auth/login`      | No            | Login with email & password |
| POST   | `/auth/google`     | No (CSRF)     | Login via Google Sign-In    |
| GET    | `/health/greet`    | Yes (JWT)     | Health check (returns user) |
