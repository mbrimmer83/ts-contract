import type { ContractPlugin, RouteDef, InferPathParams, InferQuery } from '@ts-contract/core';

type CacheKeyArgs<R extends RouteDef> = {
  params?: InferPathParams<R>;
  query?: InferQuery<R>;
};

declare module '@ts-contract/core' {
  interface PluginTypeRegistry<R> {
    cache: {
      getCacheKey: R extends RouteDef
        ? (args?: CacheKeyArgs<R>) => string[]
        : never;
    };
  }
}

/**
 * Plugin that generates cache keys for React Query or SWR.
 * 
 * @example
 * ```ts
 * const api = initContract(contract)
 *   .use(cachePlugin)
 *   .build();
 * 
 * // Use with React Query
 * function useUser(id: string) {
 *   return useQuery({
 *     queryKey: api.getUser.getCacheKey({ params: { id } }),
 *     queryFn: async () => {
 *       const response = await fetch(`/users/${id}`);
 *       return response.json();
 *     },
 *   });
 * }
 * ```
 */
export const cachePlugin: ContractPlugin<'cache'> = {
  name: 'cache',
  route: (route: RouteDef) => ({
    getCacheKey: (args: CacheKeyArgs<RouteDef> = {}) => {
      const key = [route.method, route.path];
      
      if (args.params) {
        key.push(JSON.stringify(args.params));
      }
      
      if (args.query) {
        key.push(JSON.stringify(args.query));
      }
      
      return key;
    },
  }),
};
