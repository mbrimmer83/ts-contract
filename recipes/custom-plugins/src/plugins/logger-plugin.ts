import type { ContractPlugin, RouteDef } from '@ts-contract/core';

declare module '@ts-contract/core' {
  interface PluginTypeRegistry<R> {
    logger: {
      logRoute: () => void;
    };
  }
}

/**
 * Plugin that adds logging capabilities to routes.
 * 
 * @example
 * ```ts
 * const api = initContract(contract)
 *   .use(loggerPlugin)
 *   .build();
 * 
 * api.getUser.logRoute();
 * // => "GET /users/:id"
 * ```
 */
export const loggerPlugin: ContractPlugin<'logger'> = {
  name: 'logger',
  route: (route: RouteDef) => ({
    logRoute: () => {
      console.log(`${route.method} ${route.path}`);
    },
  }),
};
