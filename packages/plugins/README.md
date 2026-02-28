# @ts-contract/plugins

Built-in plugins for path building and schema validation for ts-contract.

## Overview

`@ts-contract/plugins` provides official plugins that extend ts-contract with commonly needed functionality:

- **Path Plugin** - Build URL paths with type-safe parameter substitution
- **Validate Plugin** - Validate request/response data against schemas

## Installation

```bash
npm install @ts-contract/plugins @ts-contract/core
# or
pnpm add @ts-contract/plugins @ts-contract/core
# or
yarn add @ts-contract/plugins @ts-contract/core
```

## Plugins

### Path Plugin

Build type-safe URL paths with parameter substitution and query string generation.

#### Usage

```typescript
import { initContract } from '@ts-contract/core';
import { pathPlugin } from '@ts-contract/plugins';
import { contract } from './contract';

const api = initContract(contract).use(pathPlugin).build();

// Build path with parameters
const path = api.getUser.buildPath({ id: '123' });
// => "/users/123"

// Build path with query parameters
const path = api.listUsers.buildPath(undefined, { page: '1', limit: '10' });
// => "/users?page=1&limit=10"

// Build path with both
const path = api.searchUsers.buildPath(
  { category: 'active' },
  { sort: 'name' },
);
// => "/users/active?sort=name"
```

#### API

**`buildPath(params?, query?)`**

Builds a URL path from the route definition.

- **params** - Path parameters (typed from contract)
- **query** - Query parameters (typed from contract)
- **Returns:** String URL path

### Validate Plugin

Validate request bodies and response data against your contract schemas.

#### Usage

```typescript
import { initContract } from '@ts-contract/core';
import { validatePlugin } from '@ts-contract/plugins';
import { contract } from './contract';

const api = initContract(contract).use(validatePlugin).build();

// Validate request body
try {
  const validatedBody = api.createUser.validateBody({
    name: 'Alice',
    email: 'alice@example.com',
  });
  // validatedBody is typed and validated
} catch (error) {
  // Validation failed
}

// Validate response
try {
  const validatedResponse = api.getUser.validateResponse(200, {
    id: '123',
    name: 'Alice',
    email: 'alice@example.com',
  });
  // validatedResponse is typed and validated
} catch (error) {
  // Validation failed
}

// Validate path parameters
const validatedParams = api.getUser.validatePathParams({ id: '123' });

// Validate query parameters
const validatedQuery = api.listUsers.validateQuery({ page: '1', limit: '10' });

// Validate headers
const validatedHeaders = api.getUser.validateHeaders({
  authorization: 'Bearer token',
});
```

#### API

**`validateBody(data)`**

Validates request body data against the route's body schema.

- **data** - Data to validate
- **Returns:** Validated and typed data
- **Throws:** Validation error if data is invalid

**`validateResponse(status, data)`**

Validates response data against the route's response schema for a specific status code.

- **status** - HTTP status code
- **data** - Data to validate
- **Returns:** Validated and typed data
- **Throws:** Validation error if data is invalid

**`validatePathParams(data)`**

Validates path parameters against the route's pathParams schema.

**`validateQuery(data)`**

Validates query parameters against the route's query schema.

**`validateHeaders(data)`**

Validates headers against the route's headers schema.

## Using Both Plugins

Combine plugins for full functionality:

```typescript
import { initContract } from '@ts-contract/core';
import { pathPlugin, validatePlugin } from '@ts-contract/plugins';

const api = initContract(contract).use(pathPlugin).use(validatePlugin).build();

// Use both plugin methods
const path = api.createUser.buildPath();
const validatedBody = api.createUser.validateBody({
  name: 'Alice',
  email: 'alice@example.com',
});

// Make request
const response = await fetch(path, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(validatedBody),
});

const data = await response.json();
const validatedResponse = api.createUser.validateResponse(201, data);
```

## Type Safety

All plugin methods are fully typed based on your contract:

- Path parameters are typed from `pathParams` schema
- Query parameters are typed from `query` schema
- Request body is typed from `body` schema
- Response data is typed from `responses` schema
- TypeScript will catch type errors at compile time

## Error Handling

Validation errors include detailed information:

```typescript
try {
  api.createUser.validateBody({ name: 'Alice' }); // Missing email
} catch (error) {
  console.error(error.message);
  // Detailed validation error from schema library
}
```

## Schema Library Support

Works with any schema library that implements the [Standard Schema](https://github.com/standard-schema/standard-schema) specification:

- ✅ Zod
- ✅ Valibot
- ✅ Arktype
- ✅ And more...

## Documentation

For complete documentation and examples, visit:

- [Path Plugin Documentation](https://github.com/mbrimmer83/ts-contract/tree/main/docs/plugins/path-plugin.md)
- [Validate Plugin Documentation](https://github.com/mbrimmer83/ts-contract/tree/main/docs/plugins/validate-plugin.md)
- [Creating Custom Plugins](https://github.com/mbrimmer83/ts-contract/tree/main/docs/plugins/creating-custom-plugins.md)

## License

MIT

## Contributing

Contributions are welcome! Please see the [contributing guide](../../CONTRIBUTING.md) for details.
