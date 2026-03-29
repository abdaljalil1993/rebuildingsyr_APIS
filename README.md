# Rebuildings Project API

Production-grade RESTful API for managing reconstruction and aid requests for war-damaged houses.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- TypeORM
- MySQL2
- class-validator
- JWT + bcrypt

## Folder Structure

```text
src/
  config/
  constants/
  controllers/
  dtos/
  entities/
  middlewares/
  repositories/
  routes/
  services/
  types/
  utils/
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and fill database + JWT values.

3. Build and run:

```bash
npm run dev
```

## Core Features

- Authentication and role authorization (USER / ADMIN)
- User profile management
- Request submission/edit/delete/tracking
- Document upload for requests
- Admin request listing with filters and search
- Admin request review and status updates
- Admin statistics
- Pagination support
- Global error handling

## API Base URL

`/api/v1`

## Postman-Ready Endpoints

### Health
- `GET /health`

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout` (Auth)

### User (USER role)
- `GET /users/me`
- `PATCH /users/me`

### Requests (USER role)
- `POST /requests`
- `GET /requests?page=1&limit=10&status=PENDING&type=AID&search=text`
- `GET /requests/:id`
- `PATCH /requests/:id`
- `DELETE /requests/:id`
- `POST /requests/:id/documents` (form-data, key: `document`)

### Admin (ADMIN role)
- `GET /admin/requests?page=1&limit=10&status=PENDING&type=RECONSTRUCTION&city=Gaza&search=text`
- `PATCH /admin/requests/:id/status`
- `POST /admin/requests/:id/review`
- `GET /admin/statistics`

## Example Payloads

### Register

```json
{
  "name": "User One",
  "phone": "0599999999",
  "email": "user@example.com",
  "username": "userone",
  "password": "StrongPass123",
  "nationalId": "123456789",
  "city": "Gaza",
  "socialStatus": "Married",
  "familyMembersNumber": 5
}
```

### Login

```json
{
  "identifier": "user@example.com",
  "password": "StrongPass123"
}
```

### Create Request

```json
{
  "reqType": "RECONSTRUCTION",
  "reqDate": "2026-03-29T10:00:00.000Z",
  "description": "Severe structural damage to roof and walls",
  "withDocs": false,
  "buildingNumber": "B-1022"
}
```

### Update Request Status (Admin)

```json
{
  "status": "UNDER_REVIEW"
}
```

### Review Request (Admin)

```json
{
  "reportBy": "Engineer Ahmad",
  "reportDate": "2026-03-29T12:00:00.000Z",
  "description": "On-site inspection completed, requires full reconstruction"
}
```

## Notes

- `synchronize` is set to `false` for production safety.
- Use TypeORM migrations for schema changes.
- Logout is token invalidation on client side by design for stateless JWT.
