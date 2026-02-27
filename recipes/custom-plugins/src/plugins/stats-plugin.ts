/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ContractPlugin, RouteDef } from '@ts-contract/core';

declare module '@ts-contract/core' {
  interface PluginTypeRegistry<R> {
    stats: {
      incrementCalls: () => void;
      getCallCount: () => number;
      resetCallCount: () => void;
    };
  }
}

/**
 * Plugin that tracks call statistics for each route.
 * Each route maintains its own independent call count.
 *
 * @example
 * ```ts
 * const api = initContract(contract)
 *   .use(statsPlugin)
 *   .build();
 *
 * api.getUser.incrementCalls();
 * api.getUser.incrementCalls();
 * console.log(api.getUser.getCallCount()); // => 2
 * console.log(api.createUser.getCallCount()); // => 0
 * ```
 */
export const statsPlugin: ContractPlugin<'stats'> = {
  name: 'stats',
  route: (route: RouteDef) => {
    let callCount = 0;

    return {
      incrementCalls: () => {
        callCount++;
      },
      getCallCount: () => {
        return callCount;
      },
      resetCallCount: () => {
        callCount = 0;
      },
    };
  },
};
