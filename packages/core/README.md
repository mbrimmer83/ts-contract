# @ts-contract/core

Contract definitions, type inference helpers, and plugin system for ts-contract.

## Overview

`@ts-contract/core` is the foundational package for ts-contract, providing:

- **Contract Definition API** - Define type-safe HTTP API contracts with routes, schemas, and responses
- **Type Inference Helpers** - Extract TypeScript types from your contracts
- **Plugin System** - Extend contracts with custom functionality
- **Standard Schema Support** - Works with any schema library that implements the Standard Schema spec

## Installation

```bash
npm install @ts-contract/core
# or
pnpm add @ts-contract/core
# or
yarn add @ts-contract/core
```

## Quick Start

### Define a Contract

```typescript
import { createContract } from '@ts-contract/core';
import { z } from 'zod';

const contract = createContract({
  getUser: {
    method: 'GET',
    path: '/users/:id',
    pathParams: z.object({ id: z.string() }),
    responses: {
      200: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
      }),
      404: z.object({ message: z.string() }),
    },
  },
  createUser: {
    method: 'POST',
    path: '/users',
    body: z.object({
      name: z.string(),
      email: z.string().email(),
    }),
    responses: {
      201: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
      }),
    },
  },
});
```

### Use Type Inference

```typescript
import type {
  InferResponseBody,
  InferBody,
  InferPathParams,
} from '@ts-contract/core';

// Infer types from the contract
type User = InferResponseBody<typeof contract.getUser, 200>;
// { id: string; name: string; email: string; }

type CreateUserBody = InferBody<typeof contract.createUser>;
// { name: string; email: string; }

type UserPathParams = InferPathParams<typeof contract.getUser>;
// { id: string; }
```

### Initialize with Plugins

```typescript
import { initContract } from '@ts-contract/core';

const api = initContract(contract).use(myPlugin).build();

// Access plugin methods
api.getUser.somePluginMethod();
```

## Core API

### `createContract(routes)`

Creates a contract definition from route specifications.

**Parameters:**

- `routes` - Object mapping route names to route definitions

**Returns:** Contract definition object

### `initContract(contract)`

Initializes a contract with the plugin system.

**Parameters:**

- `contract` - Contract created with `createContract()`

**Returns:** Contract builder with `.use()` and `.build()` methods

### Type Inference Helpers

- `InferResponseBody<Route, Status>` - Extract response body type for a status code
- `InferResponses<Route>` - Extract all response types
- `InferBody<Route>` - Extract request body type
- `InferPathParams<Route>` - Extract path parameter types
- `InferQuery<Route>` - Extract query parameter types
- `InferHeaders<Route>` - Extract header types
- `InferArgs<Route>` - Extract all input argument types

## Plugin System

Create custom plugins to extend your contracts:

```typescript
import type { ContractPlugin, RouteDef } from '@ts-contract/core';

// Declare plugin types
declare module '@ts-contract/core' {
  interface PluginTypeRegistry<R> {
    myPlugin: {
      myMethod: () => string;
    };
  }
}

// Implement plugin
export const myPlugin: ContractPlugin<'myPlugin'> = {
  name: 'myPlugin',
  route: (route: RouteDef) => ({
    myMethod: () => `${route.method} ${route.path}`,
  }),
};

// Use plugin
const api = initContract(contract).use(myPlugin).build();

api.getUser.myMethod(); // "GET /users/:id"
```

## Route Definition

A route definition includes:

```typescript
{
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  pathParams?: SchemaProtocol;
  query?: SchemaProtocol;
  headers?: SchemaProtocol;
  body?: SchemaProtocol;
  responses: {
    [statusCode: number]: SchemaProtocol;
  };
  summary?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}
```

## Schema Support

Works with any schema library that implements the [Standard Schema](https://github.com/standard-schema/standard-schema) specification:

- ✅ Zod
- ✅ Valibot
- ✅ Arktype
- ✅ And more...

## TypeScript Support

Requires TypeScript 5.0 or higher for optimal type inference.

## Documentation

For complete documentation, visit [ts-contract documentation](https://github.com/mbrimmer83/ts-contract).

## License

MIT

## Contributing

Contributions are welcome! Please see the [contributing guide](../../CONTRIBUTING.md) for details.

## Running unit tests

Run `nx test core` to execute the unit tests via [Vitest](https://vitest.dev/).
