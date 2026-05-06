# Citizen Assistance API

Production-grade RESTful API for a citizen assistance platform with 3 roles:

- USER
- REVIEWER
- ADMIN

Built with Node.js, Express.js, TypeScript, TypeORM, and MySQL2.

## Architecture

The project follows a clean modular architecture:

- controllers: HTTP layer only
- services: business rules and workflow logic
- repositories: database access through TypeORM repositories
- entities: normalized database schema with relations
- middlewares: auth, role guard, validation, and error handling

## Tech Stack

- Node.js
- Express.js
- TypeScript
- TypeORM
- MySQL2
- class-validator + class-transformer
- JWT + bcrypt

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create .env from .env.example.

3. Start development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
npm start
```

## Environment

This project uses TypeORM synchronize mode (development only), no migrations.

Important variables:

- DB_HOST
- DB_PORT
- DB_USER
- DB_PASSWORD
- DB_NAME
- DB_SYNCHRONIZE=true
- JWT_SECRET
- JWT_EXPIRES_IN
- SEED_ON_START=true

## Request Workflow

1. USER chooses a service.
2. USER submits a request with dynamic request data.
3. REVIEWER reviews request, adds notes, updates status.
4. Request ends in APPROVED, REJECTED, or NEEDS_INFO.

## Core Endpoints

Base URL: /api/v1

Auth:

- POST /auth/register
- POST /auth/login

User:

- GET /services
- POST /requests
- GET /requests/my
- GET /requests/:id
- PATCH /requests/:id
- DELETE /requests/:id

Reviewer:

- GET /reviewer/requests
- PATCH /reviewer/requests/:id/status
- POST /reviewer/requests/:id/note

Admin:

- CRUD /admin/users
- CRUD /admin/services
- CRUD /admin/service-fields
- GET /admin/requests
- PATCH /admin/requests/:id/status
- GET /admin/statistics

## Seed Data

At startup, when SEED_ON_START=true, the API seeds:

- Services (Reconstruction, Health Aid, Humanitarian Aid)
- Dynamic service fields for each service

## Full Documentation

See PROJECT_DOCUMENTATION.md for complete system and API documentation.
