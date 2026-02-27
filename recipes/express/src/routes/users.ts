import {
  Router,
  type Router as ExpressRouter,
  type Request,
  type Response,
} from 'express';
import type { InferBody, InferPathParams, InferQuery } from '@ts-contract/core';
import { api } from '../api.js';
import { contract } from '../contract.js';
import { users, generateId } from '../db.js';

const router: ExpressRouter = Router();

// GET /api/users
router.get('/users', (_req: Request, res: Response) => {
  const allUsers = Array.from(users.values());
  res.json(allUsers);
});

// GET /api/users/:id
router.get<InferPathParams<typeof contract.users.get>>(
  '/users/:id',
  (req, res) => {
    const { id } = req.params; // id is typed as string
    const user = users.get(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  },
);

// POST /api/users
router.post<
  Record<string, never>,
  unknown,
  InferBody<typeof contract.users.create>
>('/users', (req, res) => {
  try {
    const body = api.users.create.validateBody(req.body); // body is typed
    const newUser = { id: generateId(), ...body };

    users.set(newUser.id, newUser);
    res.status(201).json(newUser);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Validation failed';
    res.status(400).json({ message });
  }
});

// GET /api/users/:id/posts - Demonstrates both path params AND query params
router.get<
  InferPathParams<typeof contract.users.search>,
  unknown,
  unknown,
  InferQuery<typeof contract.users.search>
>('/users/:id/posts', (req, res) => {
  const { id } = req.params; // Typed: { id: string }
  const { status, limit } = req.query; // Typed: { status?: 'draft' | 'published'; limit?: string }

  // Mock response - in real app would query database
  const posts = [
    { id: '1', title: `Post by user ${id}`, status: status || 'published' },
    { id: '2', title: `Another post by user ${id}`, status: 'draft' },
  ];

  const limitNum = limit ? parseInt(limit) : posts.length;
  res.json(posts.slice(0, limitNum));
});

export default router;
