import { createContract } from '@ts-contract/core';
import { z } from 'zod';

export const contract = createContract({
  users: {
    list: {
      method: 'GET',
      path: '/api/users',
      query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
      }),
      responses: {
        200: z.object({
          users: z.array(z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
          })),
          total: z.number(),
        }),
      },
    },
    get: {
      method: 'GET',
      path: '/api/users/:id',
      pathParams: z.object({ id: z.string() }),
      responses: {
        200: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
        }),
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
        201: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
        }),
        400: z.object({ message: z.string() }),
      },
    },
    update: {
      method: 'PUT',
      path: '/api/users/:id',
      pathParams: z.object({ id: z.string() }),
      body: z.object({
        name: z.string().min(1),
        email: z.string().email(),
      }),
      responses: {
        200: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
        }),
        404: z.object({ message: z.string() }),
        400: z.object({ message: z.string() }),
      },
    },
    delete: {
      method: 'DELETE',
      path: '/api/users/:id',
      pathParams: z.object({ id: z.string() }),
      responses: {
        204: z.null(),
        404: z.object({ message: z.string() }),
      },
    },
  },
});
