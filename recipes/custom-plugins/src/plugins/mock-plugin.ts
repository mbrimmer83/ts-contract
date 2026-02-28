import type { ContractPlugin, RouteDef } from '@ts-contract/core';

declare module '@ts-contract/core' {
  interface PluginTypeRegistry<R> {
    mock: {
      generateMockResponse: (status: number) => unknown;
    };
  }
}

/**
 * Plugin that generates mock response data based on schemas.
 *
 * @example
 * ```ts
 * const api = initContract(contract)
 *   .use(mockPlugin)
 *   .build();
 *
 * const mockUser = api.getUser.generateMockResponse(200);
 * ```
 */
export const mockPlugin: ContractPlugin<'mock'> = {
  name: 'mock',
  route: (route: RouteDef) => ({
    generateMockResponse: (status: number) => {
      const schema = route.responses[status as keyof typeof route.responses];

      if (!schema) {
        throw new Error(`No response schema for status ${status}`);
      }

      // Simple mock generation
      // In a real implementation, you'd use a library like faker or zod-mock
      return {
        id: '123',
        name: 'Mock User',
        email: 'mock@example.com',
      };
    },
  }),
};
