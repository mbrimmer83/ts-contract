import type { User } from '@ts-contract-recipes/shared';

export const users = new Map<string, User>([
  ['1', { id: '1', name: 'Alice', email: 'alice@example.com' }],
  ['2', { id: '2', name: 'Bob', email: 'bob@example.com' }],
  ['3', { id: '3', name: 'Charlie', email: 'charlie@example.com' }],
]);

let nextId = 4;

export function generateId(): string {
  return String(nextId++);
}
