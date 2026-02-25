# ts-contract

[![CI](https://github.com/mbrimmer83/ts-contract/actions/workflows/ci.yml/badge.svg)](https://github.com/mbrimmer83/ts-contract/actions/workflows/ci.yml)
[![PR Checks](https://github.com/mbrimmer83/ts-contract/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/mbrimmer83/ts-contract/actions/workflows/pr-checks.yml)

> **🚧 This project is under active development and not yet ready for production use. No alpha version has been published.**

An opinionated schema-first TypeScript contract library for defining type-safe HTTP and WebSocket APIs.

## Why ts-contract?

**Minimal by design. No framework integrations.**

Every integration adds surface area, complexity, and long-term maintenance burden. ts-contract stays focused on a small, durable core with first-class TypeScript inference and composable primitives that make it easy to integrate with any stack.

- **Small core. Zero integrations.** — No lock-in to any server or client framework.
- **Schema-first.** — Define your API shape with the validation library you already use.
- **Excellent TypeScript inference.** — Extract path params, query, body, headers, and response types from your contract.
- **Composable primitives.** — Add capabilities through a plugin system, not monolithic abstractions.
- **Integrate it your way.** — Use the inference types to wire up Hono, Express, Fastify, React Query, or anything else.
- **Supports [@standard-schema/spec](https://github.com/standard-schema/standard-schema).** — Works with Zod, Valibot, Arktype, and any Standard Schema compliant library.

## Quick Example

```ts
import { createContract, initContract } from '@ts-contract/core';
import { pathPlugin, validatePlugin } from '@ts-contract/plugins';
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
        email: z.string().email(),
      }),
      404: z.object({ message: z.string() }),
    },
  },
});

const api = initContract(contract).use(pathPlugin).use(validatePlugin).build();

// Type-safe URL construction
const url = api.getUser.buildPath({ id: '123' });
// => "/users/123"

// Runtime validation against your schema
const user = api.getUser.validateResponse(200, data);
// => { id: string, name: string, email: string }
```

## Packages

| Package                | Description                                                     |
| ---------------------- | --------------------------------------------------------------- |
| `@ts-contract/core`    | Contract definitions, type inference helpers, and plugin system |
| `@ts-contract/plugins` | Built-in plugins for path building and schema validation        |

## Documentation

Documentation is available at the [docs site](https://ts-contract.com) (coming soon).

To run the docs locally:

```bash
pnpm install
pnpm --filter @ts-contract/docs dev
```

## Development

This is a monorepo using [pnpm](https://pnpm.io) workspaces.

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm -r build

# Run tests
pnpm -r test

# Run docs dev server
pnpm --filter @ts-contract/docs dev
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Setting up your development environment
- Our development workflow
- How to create changesets for version management
- Pull request process
- Release process

## License

[MIT](./apps/docs/LICENSE)
