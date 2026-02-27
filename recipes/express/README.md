# Express Recipe

A runnable example demonstrating ts-contract integration with Express.

## Features

- Type-safe API routes with Express
- Request validation with validatePlugin
- CRUD operations for users
- Error handling middleware
- CORS support

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

Server runs on http://localhost:3001

## API Endpoints

- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## Project Structure

```
src/
├── index.ts          # Express server setup
├── contract.ts       # API contract definition
├── api.ts            # Contract with plugins
├── routes/
│   └── users.ts      # User routes
└── db.ts             # In-memory database
```
