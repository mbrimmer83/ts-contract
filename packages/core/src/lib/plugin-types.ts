import type { RouteDef, ContractDef } from './dsl';
import type { WebSocketDef } from './websocket-types';

/**
 * Plugin type registry — plugins register their per-route return types here
 * via declaration merging.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
export interface PluginTypeRegistry<R> {}

/**
 * WebSocket plugin type registry — plugins register their per-WebSocket return types here
 * via declaration merging.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
export interface WebSocketPluginTypeRegistry<W> {}

/**
 * A contract plugin that adds utility methods to each route.
 */
export interface ContractPlugin<Name extends string = string> {
  name: Name;
  route: (route: RouteDef) => Record<string, unknown>;
}

/**
 * A WebSocket plugin that adds utility methods to each WebSocket definition.
 */
export interface WebSocketPlugin<Name extends string = string> {
  name: Name;
  websocket: (def: WebSocketDef) => Record<string, unknown>;
}

/**
 * Look up a plugin's return type from the registry for a given route.
 */
type PluginReturnFor<
  Name extends string,
  R extends RouteDef,
> = Name extends keyof PluginTypeRegistry<R>
  ? PluginTypeRegistry<R>[Name]
  : object;

/**
 * Look up a WebSocket plugin's return type from the registry for a given WebSocket definition.
 */
type WebSocketPluginReturnFor<
  Name extends string,
  W extends WebSocketDef,
> = Name extends keyof WebSocketPluginTypeRegistry<W>
  ? WebSocketPluginTypeRegistry<W>[Name]
  : object;

/**
 * Merge return types from all plugins in a tuple for a given route.
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
 * Merge return types from all WebSocket plugins in a tuple for a given WebSocket definition.
 */
export type MergeWebSocketPluginReturns<
  W extends WebSocketDef,
  Ps extends readonly WebSocketPlugin[],
> = Ps extends readonly [
  infer First extends WebSocketPlugin,
  ...infer Rest extends WebSocketPlugin[],
]
  ? WebSocketPluginReturnFor<First['name'], W> &
      MergeWebSocketPluginReturns<W, Rest>
  : object;

/**
 * Recursively apply plugins to a contract, producing a mapped type
 * where each RouteDef is replaced with the merged plugin return types.
 */
export type ApplyPlugins<C, Ps extends readonly ContractPlugin[]> = {
  [K in keyof C]: C[K] extends RouteDef
    ? MergePluginReturns<C[K], Ps>
    : C[K] extends ContractDef
      ? ApplyPlugins<C[K], Ps>
      : object;
};

/**
 * Recursively apply WebSocket plugins to a contract, producing a mapped type
 * where each WebSocketDef is replaced with the merged plugin return types.
 */
export type ApplyWebSocketPlugins<C, Ps extends readonly WebSocketPlugin[]> = {
  [K in keyof C]: C[K] extends WebSocketDef
    ? MergeWebSocketPluginReturns<C[K], Ps>
    : C[K] extends ContractDef
      ? ApplyWebSocketPlugins<C[K], Ps>
      : object;
};
