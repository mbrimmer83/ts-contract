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
    search: {
      method: 'GET',
      path: '/api/users/:id/posts',
      pathParams: z.object({ id: z.string() }),
      query: z.object({
        status: z.enum(['draft', 'published']).optional(),
        limit: z.string().optional(),
      }),
      responses: {
        200: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            status: z.string(),
          }),
        ),
      },
    },
  },
});
