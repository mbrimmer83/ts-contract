import { createContract } from '@ts-contract/core';
import { z } from 'zod';

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

export const contract = createContract({
  users: {
    list: {
      method: 'GET',
      path: '/api/users',
      responses: {
        200: z.array(userSchema),
      },
    },
    get: {
      method: 'GET',
      path: '/api/users/:id',
      pathParams: z.object({ id: z.string() }),
      responses: {
        200: userSchema,
        404: z.object({ message: z.string() }),
      },
    },
    create: {
      method: 'POST',
      path: '/api/users',
      body: z.object({
        name: z.string().min(1),
        email: z.string().email(),
      }),
      responses: {
        201: userSchema,
        400: z.object({ message: z.string() }),
      },
    },
  },
});
