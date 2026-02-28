import type { ContractDef, RouteDef } from './dsl';
import { isRouteDef, isWebSocketDef } from './dsl';
import type { WebSocketDef } from './websocket-types';
import type {
  ContractPlugin,
  WebSocketPlugin,
  ApplyPlugins,
  ApplyWebSocketPlugins,
} from './plugin-types';

/**
 * Recursively walk a contract tree, applying mapper functions to each RouteDef and WebSocketDef.
 */
function mapDefinitions(
  contract: ContractDef,
  routeMapper: (route: RouteDef) => Record<string, unknown>,
  websocketMapper: (ws: WebSocketDef) => Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(contract)) {
    if (isRouteDef(value)) {
      result[key] = routeMapper(value);
    } else if (isWebSocketDef(value)) {
      result[key] = websocketMapper(value);
    } else {
      result[key] = mapDefinitions(
        value as ContractDef,
        routeMapper,
        websocketMapper,
      );
    }
  }
  return result;
}

/**
 * Builder that accumulates plugins and resolves them on .build().
 */
class ContractBuilder<
  C extends ContractDef,
  Ps extends readonly ContractPlugin[],
  WPs extends readonly WebSocketPlugin[],
> {
  constructor(
    private readonly contract: C,
    private readonly plugins: [...Ps],
    private readonly websocketPlugins: [...WPs],
  ) {}

  use<P extends ContractPlugin>(
    plugin: P,
  ): ContractBuilder<C, [...Ps, P], WPs> {
    return new ContractBuilder(
      this.contract,
      [...this.plugins, plugin],
      this.websocketPlugins,
    );
  }

  useWebSocket<P extends WebSocketPlugin>(
    plugin: P,
  ): ContractBuilder<C, Ps, [...WPs, P]> {
    return new ContractBuilder(this.contract, this.plugins, [
      ...this.websocketPlugins,
      plugin,
    ]);
  }

  build(): ApplyPlugins<C, Ps> & ApplyWebSocketPlugins<C, WPs> {
    const plugins = this.plugins;
    const websocketPlugins = this.websocketPlugins;
    return mapDefinitions(
      this.contract,
      (route) => {
        const extended: Record<string, unknown> = {};
        for (const plugin of plugins) {
          Object.assign(extended, plugin.route(route));
        }
        return extended;
      },
      (ws) => {
        const extended: Record<string, unknown> = {};
        for (const plugin of websocketPlugins) {
          Object.assign(extended, plugin.websocket(ws));
        }
        return extended;
      },
    ) as ApplyPlugins<C, Ps> & ApplyWebSocketPlugins<C, WPs>;
  }
}

/**
 * Create a contract builder that lets you compose plugins onto routes and WebSocket definitions.
 */
export const initContract = <C extends ContractDef>(
  contract: C,
): ContractBuilder<C, [], []> => {
  return new ContractBuilder(contract, [], []);
};
