# Custom Plugins Recipe

This recipe demonstrates how to create custom plugins for ts-contract. It implements all the example plugins from the documentation with comprehensive tests.

## Plugins Implemented

1. **Logger Plugin** - Logs route information
2. **OpenAPI Plugin** - Generates OpenAPI metadata
3. **Mock Plugin** - Generates mock response data
4. **Request Plugin** - Builds fetch requests
5. **Cache Plugin** - Generates cache keys for React Query/SWR
6. **Stats Plugin** - Tracks route call statistics

## Installation

```bash
pnpm install
```

## Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Type check
pnpm type-check
```

## Plugin Examples

Each plugin is in its own file under `src/plugins/` with corresponding tests in `src/plugins/__tests__/`.

### Logger Plugin

```ts
import { loggerPlugin } from './plugins/logger-plugin';

const api = initContract(contract)
  .use(loggerPlugin)
  .build();

api.getUser.logRoute();
// => "GET /users/:id"
```

### OpenAPI Plugin

```ts
import { openapiPlugin } from './plugins/openapi-plugin';

const api = initContract(contract)
  .use(openapiPlugin)
  .build();

const operation = api.getUser.getOpenAPIOperation();
```

### Mock Plugin

```ts
import { mockPlugin } from './plugins/mock-plugin';

const api = initContract(contract)
  .use(mockPlugin)
  .build();

const mockData = api.getUser.generateMockResponse(200);
```

### Request Plugin

```ts
import { requestPlugin } from './plugins/request-plugin';

const api = initContract(contract)
  .use(requestPlugin)
  .build();

const request = api.createUser.buildRequest({
  body: { name: 'Alice', email: 'alice@example.com' }
});
```

### Cache Plugin

```ts
import { cachePlugin } from './plugins/cache-plugin';

const api = initContract(contract)
  .use(cachePlugin)
  .build();

const key = api.getUser.getCacheKey({ params: { id: '123' } });
```

### Stats Plugin

```ts
import { statsPlugin } from './plugins/stats-plugin';

const api = initContract(contract)
  .use(statsPlugin)
  .build();

api.getUser.incrementCalls();
console.log(api.getUser.getCallCount()); // => 1
```

## Learn More

See the [Creating Custom Plugins](../../apps/docs/content/plugins/creating-custom-plugins.mdx) documentation for detailed explanations of each plugin.
