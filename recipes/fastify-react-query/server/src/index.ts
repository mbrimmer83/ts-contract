import Fastify from 'fastify';
import type { RouteGenericInterface } from 'fastify';
import cors from '@fastify/cors';
import {
  api,
  contract,
  type User,
  type UserList,
  type CreateUserBody,
  type UpdateUserBody,
} from '@ts-contract-recipes/shared';
import type { InferPathParams, InferQuery } from '@ts-contract/core';
import { users, generateId } from './db.js';

// Define additional types from contract
type UserPathParams = InferPathParams<typeof contract.users.get>;
type UserListQuery = InferQuery<typeof contract.users.list>;

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: true,
});

// GET /api/users - Typed with query parameters
interface ListUsersRoute extends RouteGenericInterface {
  Querystring: UserListQuery;
  Reply: UserList;
}

fastify.get<ListUsersRoute>('/api/users', async (request, reply) => {
  const { page = '1', limit = '10' } = request.query;

  const allUsers = Array.from(users.values());
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const start = (pageNum - 1) * limitNum;

  return {
    users: allUsers.slice(start, start + limitNum),
    total: allUsers.length,
  };
});

// GET /api/users/:id - Typed with path params and response
interface GetUserRoute extends RouteGenericInterface {
  Params: UserPathParams;
  Reply: User | { message: string };
}

fastify.get<GetUserRoute>('/api/users/:id', async (request, reply) => {
  const { id } = request.params;
  const user = users.get(id);

  if (!user) {
    reply.status(404);
    return { message: 'User not found' };
  }

  return user;
});

// POST /api/users - Typed with body and response
interface CreateUserRoute extends RouteGenericInterface {
  Body: CreateUserBody;
  Reply: User | { message: string };
}

fastify.post<CreateUserRoute>('/api/users', async (request, reply) => {
  try {
    const body = api.users.create.validateBody(request.body);
    const newUser: User = { id: generateId(), ...body };

    users.set(newUser.id, newUser);

    reply.status(201);
    return newUser;
  } catch (error: unknown) {
    reply.status(400);
    const message =
      error instanceof Error ? error.message : 'Validation failed';
    return { message };
  }
});

// PUT /api/users/:id - Typed with params, body, and response
interface UpdateUserRoute extends RouteGenericInterface {
  Params: UserPathParams;
  Body: UpdateUserBody;
  Reply: User | { message: string };
}

fastify.put<UpdateUserRoute>('/api/users/:id', async (request, reply) => {
  try {
    const { id } = request.params;
    const user = users.get(id);

    if (!user) {
      reply.status(404);
      return { message: 'User not found' };
    }

    const body = api.users.update.validateBody(request.body);
    const updatedUser: User = { id, ...body };

    users.set(id, updatedUser);

    return updatedUser;
  } catch (error: unknown) {
    reply.status(400);
    const message =
      error instanceof Error ? error.message : 'Validation failed';
    return { message };
  }
});

// DELETE /api/users/:id - Typed with params and response
interface DeleteUserRoute extends RouteGenericInterface {
  Params: UserPathParams;
  Reply: null | { message: string };
}

fastify.delete<DeleteUserRoute>('/api/users/:id', async (request, reply) => {
  const { id } = request.params;

  if (!users.has(id)) {
    reply.status(404);
    return { message: 'User not found' };
  }

  users.delete(id);
  reply.status(204);
  return null;
});

const start = async () => {
  try {
    await fastify.listen({ port: 3002 });
    console.log('Fastify server running on http://localhost:3002');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
