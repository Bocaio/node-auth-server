# Auth Boilerplate

A production-ready **authentication boilerplate** for Node.js APIs, built with **Express 5**, **TypeScript**, **MySQL** (via Kysely), and **Redis**. Clone it, wire up your `.env`, and start building.

It ships with everything a modern auth flow needs:

- Email + password registration and login
- Email verification via 6-digit OTP
- Password reset flow (forgot → OTP → reset)
- Google OAuth (One Tap / ID token)
- Access + refresh token rotation stored as httpOnly cookies
- Redis-backed refresh token store and OTP cache
- Background worker for outbound emails (Redis queue + consumer)
- Clean layered architecture with manual dependency injection
- Zod validation, centralized error handling, typed responses

---

## Tech Stack

| Category          | Technology                                                             |
| ----------------- | ---------------------------------------------------------------------- |
| **Runtime**       | Node.js 22+ (ESM)                                                      |
| **Framework**     | Express 5                                                              |
| **Language**      | TypeScript                                                             |
| **Database**      | MySQL (via `mysql2` + [Kysely](https://kysely.dev/) query builder)     |
| **Migrations**    | Kysely `Migrator` (file-based)                                         |
| **Cache / Queue** | Redis (via `redis` v5) — refresh tokens, OTP store, background jobs    |
| **Auth**          | JWT (`jsonwebtoken`), bcrypt, Google OAuth (`google-auth-library`)     |
| **Validation**    | Zod v4                                                                 |
| **Email**         | Nodemailer (Gmail / SMTP) with HTML templates                          |
| **IDs**           | UUID v7 (`uuid`)                                                       |
| **Dev Tooling**   | `tsx` (watch mode), `tsc`                                              |

---

## Project Structure

```
src/
├── config/                    # Env vars, DB, Redis, and SMTP transporters
├── constants/                 # Reusable message strings
├── controller/                # Thin HTTP handlers (auth, user, health)
├── database/
│   ├── migrations/            # Kysely migration files
│   └── migrator.ts            # CLI: up | down | latest | create
├── dependency-injection/      # Manual wiring: repos → services → controllers
├── email-templates/           # HTML email templates (OTP, welcome)
├── middlewares/               # auth, csrf, error handler
├── repository/
│   ├── mysql/                 # user repository
│   └── redis/                 # refresh-token, otp, queue
├── routes/                    # /auth, /user, /health
├── service/                   # auth, user, email business logic
├── types/                     # AppError, JwtPayload, DB tables, responses
├── utils/                     # Response helpers, cookie helpers
├── validation/                # Zod schemas + middleware factories
├── worker/                    # Base consumer + email producer/consumer
├── worker-dependency-injection/
├── index.ts                   # HTTP server entrypoint
└── worker.ts                  # Background worker entrypoint
```

Dependencies flow strictly downward: **routes → validation → controllers → services → repositories → config**. Nothing above ever imports from something below it.

---

## Quick Start

### 1. Prerequisites

- Node.js **22+**
- MySQL **8+** (running locally or reachable)
- Redis **6+** (running locally or reachable)

### 2. Install

```bash
npm install
```

### 3. Configure environment

Copy the example env file and edit values:

```bash
cp .env.example .env
```

At minimum you need to set:

- `JWT_SECRET_KEY` — generate a strong random string
- `DB_*` — your MySQL credentials
- `SMTP_USER` / `SMTP_PASSWORD` — needed for OTP + welcome emails (Gmail app password works)

Generate a strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Create the database

```sql
CREATE DATABASE auth_boilerplate;
```

### 5. Run migrations

```bash
npm run migrate:latest
```

### 6. Start the API + worker

Two terminals (recommended for development):

```bash
# Terminal 1 — HTTP server (watch mode)
npm run dev

# Terminal 2 — background worker (watch mode)
npm run dev:worker
```

Or use the helper script that runs both:

```bash
./start.sh
```

The API listens on `http://localhost:8080` by default.

---

## API Endpoints

Base URL: `http://localhost:8080`

### Auth (`/auth`)

| Method | Endpoint                  | Description                                     |
| ------ | ------------------------- | ----------------------------------------------- |
| POST   | `/auth/register`          | Create account, send OTP                        |
| POST   | `/auth/login`             | Email + password login, sets auth cookies       |
| POST   | `/auth/google`            | Google One-Tap login (verifies `credential`)    |
| POST   | `/auth/refresh`           | Rotate access + refresh tokens                  |
| POST   | `/auth/logout`            | Invalidate refresh token, clear cookies         |
| POST   | `/auth/email/otp/resend`  | Resend email OTP                                |
| POST   | `/auth/email/otp/verify`  | Verify email with OTP                           |
| POST   | `/auth/password/forget`   | Send password-reset OTP                         |
| POST   | `/auth/password/verify`   | Verify OTP, get short-lived reset token         |
| PUT    | `/auth/password/reset`    | Set new password using the reset token          |

### User (`/user`) — requires `accessToken` cookie

| Method | Endpoint  | Description             |
| ------ | --------- | ----------------------- |
| GET    | `/user/`  | Return current user     |

### Health (`/health`) — requires `accessToken` cookie

| Method | Endpoint         | Description               |
| ------ | ---------------- | ------------------------- |
| GET    | `/health/greet`  | Returns the authed user   |

---

## Response Shape

All responses follow this envelope.

**Success**

```json
{
  "success": true,
  "data": { /* ... */ },
  "message": "optional",
  "pagination": { /* optional */ }
}
```

**Error**

```json
{
  "success": false,
  "message": "human-readable error",
  "error": {
    "code": "VALIDATION_ERROR",
    "fieldErrors": [{ "field": "email", "message": "Invalid email" }]
  }
}
```

Error codes are defined in `src/types/response.ts` (`ErrorCode`).

---

## Auth Flow

### Registration

1. `POST /auth/register` → user row created, welcome-email job enqueued, OTP emailed.
2. `POST /auth/email/otp/verify` with `{ email, otp }` → sets `is_email_verified = true`.
3. `POST /auth/login` → sets `accessToken` (15m) and `refreshToken` (7d) as httpOnly cookies.

### Refresh

`POST /auth/refresh` reads the `refreshToken` cookie, checks it against the Redis set for the user, and issues a fresh pair. Old refresh token is removed (rotation).

### Password reset

1. `POST /auth/password/forget` → sends OTP to email.
2. `POST /auth/password/verify` with OTP → returns a short-lived JWT reset token.
3. `PUT /auth/password/reset` with `{ newPassword, token }` → updates the hash.

### Google login

`POST /auth/google` with body `{ credential, g_csrf_token }` and a matching `g_csrf_token` cookie. If the Google user is new, an account is created (email marked verified).

---

## Migrations

Kysely migrations live in `src/database/migrations/`. The migrator CLI supports:

```bash
npm run migrate:latest        # apply all pending migrations
npm run migrate:up            # apply next migration
npm run migrate:down          # revert last migration
npm run migrate:create <name> # create a new timestamped migration file
```

Migration filenames follow `YYYY_MM_DD_NNN_<name>.ts` so they order deterministically.

---

## Background Worker

`src/worker.ts` runs a long-lived consumer that pulls email jobs off a Redis list (`EMAIL_QUEUE`). The `AuthController.create` handler enqueues a welcome-email job; the worker's `EmailConsumer` picks it up and calls `EmailService.sendWelcome`.

To add a new job type:

1. Add its payload interface in `src/types/job/`.
2. Create a `Producer` + `Consumer` in `src/worker/<name>/`.
3. Wire them up in `src/dependency-injection/services.ts` and `src/worker-dependency-injection/`.

---

## Cookies & CORS

Access and refresh tokens are set as **httpOnly**, **sameSite=strict** cookies. `secure` is enabled when `NODE_ENV=production`.

CORS is locked to `CORS_ORIGIN` with `credentials: true` — set this to your frontend origin.

---

## Production Build

```bash
npm run build     # compiles to ./dist
npm start         # runs dist/index.js
npm run start:worker
```

Make sure `NODE_ENV=production` is set so cookies are marked `secure`.

---

## Extending the Boilerplate

- **Add a new resource** (e.g. `posts`): create `repository/mysql/post.ts`, `service/post/`, `controller/post.ts`, `routes/post.ts`, `validation/post/`, and wire them up in `dependency-injection/`.
- **Swap the DB**: replace `MysqlDialect` in `src/config/database.ts` and the migrator with the Kysely dialect of your choice (Postgres, SQLite, etc.).
- **Swap the email provider**: `src/config/email.ts` uses nodemailer; swap the transport for SES, Mailgun, Resend, etc.

---

## License

ISC — do whatever you want.
