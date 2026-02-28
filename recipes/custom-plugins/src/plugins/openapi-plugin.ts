import type { ContractPlugin, RouteDef } from '@ts-contract/core';

interface OpenAPIOperation {
  operationId: string;
  summary?: string;
  tags: string[];
  parameters: Array<{
    name: string;
    in: 'path' | 'query' | 'header';
    required: boolean;
  }>;
}

declare module '@ts-contract/core' {
  interface PluginTypeRegistry<R> {
    openapi: {
      getOpenAPIOperation: () => OpenAPIOperation;
    };
  }
}

/**
 * Plugin that generates OpenAPI metadata for routes.
 *
 * @example
 * ```ts
 * const api = initContract(contract)
 *   .use(openapiPlugin)
 *   .build();
 *
 * const operation = api.getUser.getOpenAPIOperation();
 * ```
 */
export const openapiPlugin: ContractPlugin<'openapi'> = {
  name: 'openapi',
  route: (route: RouteDef) => ({
    getOpenAPIOperation: (): OpenAPIOperation => {
      const parameters: OpenAPIOperation['parameters'] = [];

      // Extract path parameters
      const pathParams = route.path.match(/:([^/]+)/g) || [];
      pathParams.forEach((param) => {
        parameters.push({
          name: param.slice(1),
          in: 'path',
          required: true,
        });
      });

      // Extract query parameters
      if (route.query) {
        parameters.push({
          name: 'query',
          in: 'query',
          required: false,
        });
      }

      return {
        operationId: `${route.method.toLowerCase()}_${route.path.replace(/[/:]/g, '_')}`,
        summary: route.summary,
        tags: (Array.isArray(route.metadata?.tags)
          ? route.metadata.tags
          : []) as string[],
        parameters,
      };
    },
  }),
};
