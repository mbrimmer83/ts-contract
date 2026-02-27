# Fastify + React Query Recipe

A full-stack runnable example demonstrating ts-contract with Fastify backend and React Query frontend.

## Features

- **Server**: Fastify API with type-safe routes
- **Client**: React + React Query with type-safe API calls
- **Shared**: Contract package shared between server and client
- End-to-end type safety from database to UI

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

- Server runs on http://localhost:3002
- Client runs on http://localhost:5173

## Project Structure

```
├── server/          # Fastify backend
│   └── src/
│       ├── index.ts
│       └── routes/
├── client/          # React frontend
│   └── src/
│       ├── App.tsx
│       ├── lib/
│       └── hooks/
└── shared/          # Shared contract
    └── src/
        ├── contract.ts
        └── api.ts
```

## API Endpoints

- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user
