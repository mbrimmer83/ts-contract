import { createContract } from '@ts-contract/core';
import { z } from 'zod';

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

export const contract = createContract({
  getUser: {
    method: 'GET',
    path: '/users/:id',
    pathParams: z.object({ id: z.string() }),
    responses: {
      200: userSchema,
      404: z.object({ message: z.string() }),
    },
  },
  listUsers: {
    method: 'GET',
    path: '/users',
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
    }),
    responses: {
      200: z.array(userSchema),
    },
  },
  createUser: {
    method: 'POST',
    path: '/users',
    body: z.object({
      name: z.string().min(1),
      email: z.string().email(),
    }),
    responses: {
      201: userSchema,
      400: z.object({ message: z.string() }),
    },
  },
});
