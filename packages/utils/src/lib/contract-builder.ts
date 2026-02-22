import type { ContractDef, RouteDef } from '@ts-contract/core';
import type { ContractPlugin, ApplyPlugins } from './plugin-types';

/**
 * Check if a value is a RouteDef (has method and path)
 */
function isRoute(value: unknown): value is RouteDef {
  return (
    typeof value === 'object' &&
    value !== null &&
    'method' in value &&
    'path' in value
  );
}

/**
 * Recursively walk a contract tree, applying a mapper function to each RouteDef
 */
function mapRoutes(
  contract: ContractDef,
  mapper: (route: RouteDef) => Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(contract)) {
    if (isRoute(value)) {
      result[key] = mapper(value);
    } else {
      result[key] = mapRoutes(value as ContractDef, mapper);
    }
  }
  return result;
}

/**
 * Builder that accumulates plugins and resolves them on .build()
 */
class ContractBuilder<
  C extends ContractDef,
  Ps extends readonly ContractPlugin[],
> {
  constructor(
    private readonly contract: C,
    private readonly plugins: [...Ps],
  ) {}

  use<P extends ContractPlugin>(plugin: P): ContractBuilder<C, [...Ps, P]> {
    return new ContractBuilder(this.contract, [...this.plugins, plugin]);
  }

  build(): ApplyPlugins<C, Ps> {
    const plugins = this.plugins;
    return mapRoutes(this.contract, (route) => {
      const extended: Record<string, unknown> = {};
      for (const plugin of plugins) {
        Object.assign(extended, plugin.route(route));
      }
      return extended;
    }) as ApplyPlugins<C, Ps>;
  }
}

/**
 * Create a contract builder that lets you compose plugins onto routes
 */
export const initContract = <C extends ContractDef>(
  contract: C,
): ContractBuilder<C, []> => {
  return new ContractBuilder(contract, []);
};
