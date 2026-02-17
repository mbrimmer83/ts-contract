/**
 * HTTP methods
 */
export type Method =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'OPTIONS'
  | 'HEAD';

export const methods = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'OPTIONS',
  'HEAD',
] as const satisfies readonly Method[];

export type HttpSuccessStatusCode =
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 208
  | 226;

/**
 * Successful HTTP status codes
 */
export const successfulHttpStatusCodes = [
  200, 201, 202, 203, 204, 205, 206, 207, 208, 226,
] as const satisfies readonly HttpSuccessStatusCode[];

/**
 * All HTTP status codes
 */
export type HttpStatusCodes =
  | 100
  | 101
  | 102
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 208
  | 226
  | 300
  | 301
  | 302
  | 303
  | 304
  | 305
  | 307
  | 308
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 419
  | 420
  | 421
  | 422
  | 423
  | 424
  | 428
  | 429
  | 431
  | 451
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 507
  | 511;

export const httpStatusCodes = [
  100, 101, 102, 200, 201, 202, 203, 204, 205, 206, 207, 208, 226, 300, 301,
  302, 303, 304, 305, 307, 308, 400, 401, 402, 403, 404, 405, 406, 407, 408,
  409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423,
  424, 428, 429, 431, 451, 500, 501, 502, 503, 504, 505, 507, 511,
] as const satisfies readonly HttpStatusCodes[];

/**
 * Error HTTP status codes (all except successful ones)
 */
export type ErrorHttpStatusCodes = Exclude<
  HttpStatusCodes,
  HttpSuccessStatusCode
>;
