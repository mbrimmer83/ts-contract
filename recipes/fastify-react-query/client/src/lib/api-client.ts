import { api, type User, type UserList, type CreateUserBody, type UpdateUserBody } from '@ts-contract-recipes/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message);
  }
  
  if (response.status === 204) {
    return null as T;
  }
  
  return response.json();
}

export async function fetchUsers(page?: string, limit?: string): Promise<UserList> {
  const url = api.users.list.buildPath(undefined, { page, limit });
  const data = await apiFetch<unknown>(url);
  return api.users.list.validateResponse(200, data);
}

export async function fetchUser(id: string): Promise<User> {
  const url = api.users.get.buildPath({ id });
  const data = await apiFetch<unknown>(url);
  return api.users.get.validateResponse(200, data);
}

export async function createUser(body: CreateUserBody): Promise<User> {
  const url = api.users.create.buildPath();
  const data = await apiFetch<unknown>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return api.users.create.validateResponse(201, data);
}

export async function updateUser(id: string, body: UpdateUserBody): Promise<User> {
  const url = api.users.update.buildPath({ id });
  const data = await apiFetch<unknown>(url, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  return api.users.update.validateResponse(200, data);
}

export async function deleteUser(id: string): Promise<void> {
  const url = api.users.delete.buildPath({ id });
  await apiFetch<null>(url, {
    method: 'DELETE',
  });
}
