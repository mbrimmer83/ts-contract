import { expectTypeOf } from 'vitest';
import { z } from 'zod';
import { createContract, isWebSocketDef, isRouteDef } from './dsl';
import type { WebSocketDef } from './websocket-types';
import type {
  InferWebSocketPathParams,
  InferWebSocketQuery,
  InferWebSocketHeaders,
  InferClientMessages,
  InferServerMessages,
  InferClientMessage,
  InferServerMessage,
} from './websocket-inference-utils';

const wsContract = createContract({
  chat: {
    type: 'websocket' as const,
    path: '/ws/chat/:roomId',
    pathParams: z.object({ roomId: z.string() }),
    query: z.object({ token: z.string() }),
    headers: {
      authorization: z.string(),
    },
    clientMessages: {
      new_msg: z.object({
        type: z.literal('new_msg'),
        body: z.string(),
      }),
      typing: z.object({
        type: z.literal('typing'),
        isTyping: z.boolean(),
      }),
    },
    serverMessages: {
      new_msg: z.object({
        type: z.literal('new_msg'),
        id: z.string(),
        body: z.string(),
        userId: z.string(),
      }),
      user_typing: z.object({
        type: z.literal('user_typing'),
        userId: z.string(),
        isTyping: z.boolean(),
      }),
    },
  },
});

describe('WebSocketDef', () => {
  it('should preserve WebSocket definition', () => {
    expectTypeOf(wsContract.chat).toExtend<WebSocketDef>();
  });

  it('should have type discriminator', () => {
    expectTypeOf(wsContract.chat.type).toEqualTypeOf<'websocket'>();
  });

  it('should preserve literal path type', () => {
    expectTypeOf(wsContract.chat.path).toExtend<string>();
  });
});

describe('isWebSocketDef', () => {
  it('should identify WebSocket definitions', () => {
    expect(isWebSocketDef(wsContract.chat)).toBe(true);
  });

  it('should distinguish from HTTP routes', () => {
    const httpContract = createContract({
      getUser: {
        method: 'GET',
        path: '/users/:id',
        pathParams: z.object({ id: z.string() }),
        responses: {
          200: z.object({ name: z.string() }),
        },
      },
    });
    expect(isWebSocketDef(httpContract.getUser)).toBe(false);
    expect(isRouteDef(httpContract.getUser)).toBe(true);
  });

  it('should distinguish from nested contracts', () => {
    const nested = createContract({
      ws: {
        chat: {
          type: 'websocket' as const,
          path: '/ws/chat',
          clientMessages: {},
          serverMessages: {},
        },
      },
    });
    expect(isWebSocketDef(nested.ws)).toBe(false);
    expect(isWebSocketDef(nested.ws.chat)).toBe(true);
  });
});

describe('InferWebSocketPathParams', () => {
  it('should infer path params from schema', () => {
    type Result = InferWebSocketPathParams<typeof wsContract.chat>;
    expectTypeOf<Result>().toEqualTypeOf<{ roomId: string }>();
  });

  it('should return undefined when no pathParams defined', () => {
    const ws = createContract({
      simple: {
        type: 'websocket' as const,
        path: '/ws/simple',
        clientMessages: {},
        serverMessages: {},
      },
    });
    expect(isWebSocketDef(ws.simple)).toBe(true);
    type Result = InferWebSocketPathParams<typeof ws.simple>;
    expectTypeOf<Result>().toEqualTypeOf<undefined>();
  });
});

describe('InferWebSocketQuery', () => {
  it('should infer query params from schema', () => {
    type Result = InferWebSocketQuery<typeof wsContract.chat>;
    expectTypeOf<Result>().toEqualTypeOf<{ token: string }>();
  });

  it('should return undefined when no query defined', () => {
    const ws = createContract({
      simple: {
        type: 'websocket' as const,
        path: '/ws/simple',
        clientMessages: {},
        serverMessages: {},
      },
    });
    expect(isWebSocketDef(ws.simple)).toBe(true);
    type Result = InferWebSocketQuery<typeof ws.simple>;
    expectTypeOf<Result>().toEqualTypeOf<undefined>();
  });
});

describe('InferWebSocketHeaders', () => {
  it('should infer headers from schema', () => {
    type Result = InferWebSocketHeaders<typeof wsContract.chat>;
    expectTypeOf<Result>().toEqualTypeOf<{ authorization: string }>();
  });

  it('should return undefined when no headers defined', () => {
    const ws = createContract({
      simple: {
        type: 'websocket' as const,
        path: '/ws/simple',
        clientMessages: {},
        serverMessages: {},
      },
    });
    expect(isWebSocketDef(ws.simple)).toBe(true);
    type Result = InferWebSocketHeaders<typeof ws.simple>;
    expectTypeOf<Result>().toEqualTypeOf<undefined>();
  });
});

describe('InferClientMessages', () => {
  it('should infer all client message types', () => {
    type Result = InferClientMessages<typeof wsContract.chat>;
    expectTypeOf<Result>().toEqualTypeOf<{
      new_msg: { type: 'new_msg'; body: string };
      typing: { type: 'typing'; isTyping: boolean };
    }>();
  });
});

describe('InferServerMessages', () => {
  it('should infer all server message types', () => {
    type Result = InferServerMessages<typeof wsContract.chat>;
    expectTypeOf<Result>().toEqualTypeOf<{
      new_msg: { type: 'new_msg'; id: string; body: string; userId: string };
      user_typing: { type: 'user_typing'; userId: string; isTyping: boolean };
    }>();
  });
});

describe('InferClientMessage', () => {
  it('should infer specific client message type', () => {
    type Result = InferClientMessage<typeof wsContract.chat, 'new_msg'>;
    expectTypeOf<Result>().toEqualTypeOf<{
      type: 'new_msg';
      body: string;
    }>();
  });

  it('should infer different message type', () => {
    type Result = InferClientMessage<typeof wsContract.chat, 'typing'>;
    expectTypeOf<Result>().toEqualTypeOf<{
      type: 'typing';
      isTyping: boolean;
    }>();
  });
});

describe('InferServerMessage', () => {
  it('should infer specific server message type', () => {
    type Result = InferServerMessage<typeof wsContract.chat, 'new_msg'>;
    expectTypeOf<Result>().toEqualTypeOf<{
      type: 'new_msg';
      id: string;
      body: string;
      userId: string;
    }>();
  });

  it('should infer different message type', () => {
    type Result = InferServerMessage<typeof wsContract.chat, 'user_typing'>;
    expectTypeOf<Result>().toEqualTypeOf<{
      type: 'user_typing';
      userId: string;
      isTyping: boolean;
    }>();
  });
});

describe('mixed HTTP and WebSocket contracts', () => {
  const mixedContract = createContract({
    http: {
      getUser: {
        method: 'GET',
        path: '/users/:id',
        pathParams: z.object({ id: z.string() }),
        responses: {
          200: z.object({ name: z.string() }),
        },
      },
    },
    ws: {
      chat: {
        type: 'websocket' as const,
        path: '/ws/chat/:roomId',
        pathParams: z.object({ roomId: z.string() }),
        clientMessages: {
          new_msg: z.object({ type: z.literal('new_msg'), body: z.string() }),
        },
        serverMessages: {
          new_msg: z.object({
            type: z.literal('new_msg'),
            id: z.string(),
            body: z.string(),
          }),
        },
      },
    },
  });

  it('should preserve both HTTP and WebSocket definitions', () => {
    expect(isRouteDef(mixedContract.http.getUser)).toBe(true);
    expect(isWebSocketDef(mixedContract.ws.chat)).toBe(true);
  });

  it('should infer types from both definition types', () => {
    type WsParams = InferWebSocketPathParams<typeof mixedContract.ws.chat>;
    expectTypeOf<WsParams>().toEqualTypeOf<{ roomId: string }>();
  });
});
