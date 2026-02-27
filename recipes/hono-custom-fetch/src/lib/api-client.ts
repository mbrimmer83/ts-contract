import { api } from '../api.js';
import type { InferResponseBody, InferBody } from '@ts-contract/core';
import { contract } from '../contract.js';

type User = InferResponseBody<typeof contract.users.get, 200>;
type UserList = InferResponseBody<typeof contract.users.list, 200>;
type CreateUserBody = InferBody<typeof contract.users.create>;

// Custom error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Interceptor types
type RequestInterceptor = (
  url: string,
  options?: RequestInit,
) => RequestInit | Promise<RequestInit>;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

// API Client class with advanced features
export class ApiClient {
  private baseUrl: string;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private cache = new Map<string, { data: unknown; timestamp: number }>();
  private cacheTTL = 5 * 60 * 1000; // 5 minutes
  private loadingStates = new Map<string, boolean>();
  private listeners = new Set<(states: Map<string, boolean>) => void>();

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Add request interceptor
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  // Add response interceptor
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  // Subscribe to loading state changes
  subscribe(listener: (states: Map<string, boolean>) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.loadingStates));
  }

  // Core fetch with interceptors
  private async fetchWithInterceptors<T>(
    url: string,
    options?: RequestInit,
  ): Promise<T> {
    let finalOptions = options || {};

    // Apply request interceptors
    for (const interceptor of this.requestInterceptors) {
      finalOptions = await interceptor(url, finalOptions);
    }

    let response = await fetch(`${this.baseUrl}${url}`, finalOptions);

    // Apply response interceptors
    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response);
    }

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      const message =
        data && typeof data === 'object' && 'message' in data
          ? String(data.message)
          : `HTTP ${response.status}`;
      throw new ApiError(message, response.status, data);
    }

    if (response.status === 204) {
      return null as T;
    }

    return response.json() as Promise<T>;
  }

  // Fetch with retry logic
  async fetchWithRetry<T>(
    url: string,
    options?: RequestInit,
    retries = 3,
  ): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        return await this.fetchWithInterceptors<T>(url, options);
      } catch (error) {
        if (i === retries - 1) throw error;

        // Wait before retrying (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 1000),
        );
      }
    }

    throw new Error('Max retries exceeded');
  }

  // Fetch with timeout
  async fetchWithTimeout<T>(
    url: string,
    options?: RequestInit,
    timeout = 5000,
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const result = await this.fetchWithInterceptors<T>(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return result;
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }
      throw error;
    }
  }

  // Fetch with caching (GET only)
  async fetchWithCache<T>(url: string, options?: RequestInit): Promise<T> {
    if (options?.method && options.method !== 'GET') {
      return this.fetchWithInterceptors<T>(url, options);
    }

    const cacheKey = url;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data as T;
    }

    const data = await this.fetchWithInterceptors<T>(url, options);
    this.cache.set(cacheKey, { data, timestamp: Date.now() });

    return data;
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Fetch with loading state tracking
  async fetchWithLoading<T>(
    key: string,
    url: string,
    options?: RequestInit,
  ): Promise<T> {
    this.loadingStates.set(key, true);
    this.notify();

    try {
      const data = await this.fetchWithInterceptors<T>(url, options);
      return data;
    } finally {
      this.loadingStates.set(key, false);
      this.notify();
    }
  }

  // API methods
  async getUsers(): Promise<UserList> {
    const url = api.users.list.buildPath();
    const data = await this.fetchWithCache<unknown>(url);
    return api.users.list.validateResponse(200, data);
  }

  async getUser(id: string): Promise<User> {
    const url = api.users.get.buildPath({ id });
    const data = await this.fetchWithRetry<unknown>(url);
    return api.users.get.validateResponse(200, data);
  }

  async createUser(body: CreateUserBody): Promise<User> {
    const url = api.users.create.buildPath();
    const data = await this.fetchWithTimeout<unknown>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return api.users.create.validateResponse(201, data);
  }
}

// Create and export a default instance
export const apiClient = new ApiClient('http://localhost:3003');

// Example: Add auth interceptor
apiClient.addRequestInterceptor((url, options) => ({
  ...options,
  headers: {
    ...options?.headers,
    // 'Authorization': `Bearer ${getToken()}`,
  },
}));

// Example: Add logging interceptor
apiClient.addResponseInterceptor(async (response) => {
  console.log(`${response.status} ${response.url}`);
  return response;
});
