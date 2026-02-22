import type { RouteDef, ContractDef } from '@ts-contract/core';

/**
 * Plugin type registry — plugins register their per-route return types here
 * via declaration merging.
 *
 * Each plugin adds an entry: `[pluginName]: (route: R) => ReturnType`
 *
 * Example (in plugins/my-plugin.ts):
 * ```ts
 * declare module '../plugin-types' {
 *   interface PluginTypeRegistry<R extends RouteDef> {
 *     myPlugin: { greet: () => R['method'] };
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-interface
export interface PluginTypeRegistry<R extends RouteDef> {}

/**
 * A contract plugin that adds utility methods to each route.
 *
 * - `Name`: must match a key in PluginTypeRegistry
 * - `route`: the runtime function that produces the utility methods
 */
export interface ContractPlugin<Name extends string = string> {
  name: Name;
  route: (route: RouteDef) => Record<string, unknown>;
}

/**
 * Look up a plugin's return type from the registry for a given route
 */
type PluginReturnFor<
  Name extends string,
  R extends RouteDef,
> = Name extends keyof PluginTypeRegistry<R>
  ? PluginTypeRegistry<R>[Name]
  : object;

/**
 * Merge return types from all plugins in a tuple for a given route
 */
export type MergePluginReturns<
  R extends RouteDef,
  Ps extends readonly ContractPlugin[],
> = Ps extends readonly [
  infer First extends ContractPlugin,
  ...infer Rest extends ContractPlugin[],
]
  ? PluginReturnFor<First['name'], R> & MergePluginReturns<R, Rest>
  : object;

/**
 * Recursively apply plugins to a contract, producing a mapped type
 * where each RouteDef is replaced with the merged plugin return types
 */
export type ApplyPlugins<C, Ps extends readonly ContractPlugin[]> = {
  [K in keyof C]: C[K] extends RouteDef
    ? MergePluginReturns<C[K], Ps>
    : C[K] extends ContractDef
      ? ApplyPlugins<C[K], Ps>
      : never;
};
