import type { InferResponseBody, InferBody } from '@ts-contract/core';
import { contract } from './contract.js';

export type User = InferResponseBody<typeof contract.users.get, 200>;
export type UserList = InferResponseBody<typeof contract.users.list, 200>;
export type CreateUserBody = InferBody<typeof contract.users.create>;
export type UpdateUserBody = InferBody<typeof contract.users.update>;
