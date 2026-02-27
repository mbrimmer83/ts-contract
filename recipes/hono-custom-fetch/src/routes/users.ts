import { Hono } from 'hono';
import type {
  InferResponseBody,
  InferBody,
  InferPathParams,
} from '@ts-contract/core';
import { api } from '../api.js';
import { contract } from '../contract.js';
import { users, generateId } from '../db.js';

// Define types from contract
type User = InferResponseBody<typeof contract.users.get, 200>;
type UserList = InferResponseBody<typeof contract.users.list, 200>;
type CreateUserBody = InferBody<typeof contract.users.create>;
type UserPathParams = InferPathParams<typeof contract.users.get>;

// Create typed Hono app with route bindings
type Bindings = {
  Variables: Record<string, never>;
};

const app = new Hono<{ Bindings: Bindings }>();

// GET /api/users - Returns array of users
app.get('/users', (c) => {
  const allUsers = Array.from(users.values());
  return c.json<UserList>(allUsers);
});

// GET /api/users/:id - Returns single user or 404
app.get('/users/:id', (c) => {
  const { id } = c.req.param() as UserPathParams;
  const user = users.get(id);

  if (!user) {
    return c.json({ message: 'User not found' }, 404);
  }

  return c.json<User>(user);
});

// POST /api/users - Creates new user
app.post('/users', async (c) => {
  try {
    const body = await c.req.json<CreateUserBody>();
    const validated = api.users.create.validateBody(body);
    const newUser: User = { id: generateId(), ...validated };

    users.set(newUser.id, newUser);
    return c.json<User>(newUser, 201);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Validation failed';
    return c.json({ message }, 400);
  }
});

export default app;
