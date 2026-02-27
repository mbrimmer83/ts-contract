# Hono + Custom Fetch Recipe

A runnable example demonstrating ts-contract integration with Hono and a custom fetch client with advanced features.

## Features

- **Server**: Hono API with type-safe routes
- **Client**: Custom fetch client with:
  - Request/response interceptors
  - Retry logic with exponential backoff
  - Timeout support
  - Client-side caching
  - Loading state management
  - Custom error handling

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

Server runs on http://localhost:3003

## Testing the Client

```bash
pnpm test
```

## API Endpoints

- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## Project Structure

```
src/
├── index.ts              # Hono server
├── contract.ts           # API contract
├── api.ts                # Contract with plugins
├── db.ts                 # In-memory database
├── routes/
│   └── users.ts          # User routes
└── lib/
    ├── api-client.ts     # Custom fetch client
    └── api-client.test.ts # Client tests
```

## Custom Fetch Features

### Request Interceptors

Add authentication, logging, or modify requests before they're sent.

### Response Interceptors

Handle errors, refresh tokens, or transform responses.

### Retry Logic

Automatically retry failed requests with exponential backoff.

### Timeout Support

Set request timeouts with AbortController.

### Caching

Cache GET requests to reduce server load.

### Loading States

Track loading states for multiple concurrent requests.
