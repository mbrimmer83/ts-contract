import type {
  ContractPlugin,
  RouteDef,
  InferPathParams,
  InferQuery,
  InferBody,
} from '@ts-contract/core';

type RequestOptions<R extends RouteDef> = {
  params?: InferPathParams<R>;
  query?: InferQuery<R>;
  body?: InferBody<R>;
  headers?: Record<string, string>;
};

declare module '@ts-contract/core' {
  interface PluginTypeRegistry<R> {
    request: {
      buildRequest: R extends RouteDef
        ? (options?: RequestOptions<R>) => Request
        : never;
    };
  }
}

/**
 * Plugin that builds complete fetch Request objects.
 *
 * @example
 * ```ts
 * const api = initContract(contract)
 *   .use(requestPlugin)
 *   .build();
 *
 * const request = api.createUser.buildRequest({
 *   body: { name: 'Alice', email: 'alice@example.com' },
 *   headers: { 'Authorization': 'Bearer token' },
 * });
 *
 * const response = await fetch(request);
 * ```
 */
export const requestPlugin: ContractPlugin<'request'> = {
  name: 'request',
  route: (route: RouteDef) => ({
    buildRequest: (options: RequestOptions<RouteDef> = {}) => {
      // Build path
      let path = route.path;
      if (options.params) {
        path = path.replace(/:([^/]+)/g, (_, key) => {
          return encodeURIComponent(
            options.params![key as keyof typeof options.params] as string,
          );
        });
      }

      // Add query string
      if (options.query) {
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(options.query)) {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        }
        const qs = searchParams.toString();
        if (qs) path += `?${qs}`;
      }

      // Build request
      const init: RequestInit = {
        method: route.method,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      };

      if (options.body) {
        init.body = JSON.stringify(options.body);
      }

      // Use a base URL for the Request constructor
      // In a real implementation, this would be configurable
      const url = new URL(path, 'http://localhost');
      return new Request(url, init);
    },
  }),
};
