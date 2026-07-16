/**
 * définition de la class d'erreur httpError/definition of the httpError class
 * 
 * @returns une erreur http avec un code d'erreur 404
 */
export class HttpError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// #region HttpError 3XX
/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 300
 */
export class MultipleChoicesError extends HttpError {
  constructor(message: string = "Multiple choices") {
    super(message, 300);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 301
 */
export class MovedPermanentlyError extends HttpError {
  constructor(message: string = "Moved permanently") {
    super(message, 301);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 302
 */
export class FoundError extends HttpError {
  constructor(message: string = "Found") {
    super(message, 302);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 303
 */
export class SeeOtherError extends HttpError {
  constructor(message: string = "See other") {
    super(message, 303);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 304
 */
export class NotModifiedError extends HttpError {
  constructor(message: string = "Not modified") {
    super(message, 304);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 307
 */
export class TemporaryRedirectError extends HttpError {
  constructor(message: string = "Temporary redirect") {
    super(message, 307);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 308
 */
export class PermanentRedirectError extends HttpError {
  constructor(message: string = "Permanent redirect") {
    super(message, 308);
  }
}
// #endregion

// #region HttpError 4XX
/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 400
 */
export class BadRequestError extends HttpError {
  constructor(message: string = "Bad request") {
    super(message, 400);
  }
}
/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 401
 */
export class UnauthorizedError extends HttpError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}
/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 403
 */
export class ForbiddenError extends HttpError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}
/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 404
 */
export class NotFoundError extends HttpError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}
/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 405
 */
export class MethodNotAllowedError extends HttpError {
  constructor(message: string = "Method not allowed") {
    super(message, 405);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 406
 */
export class NotAcceptableError extends HttpError {
  constructor(message: string = "Not acceptable") {
    super(message, 406);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 407
 */
export class ProxyAuthenticationRequiredError extends HttpError {
  constructor(message: string = "Proxy authentication required") {
    super(message, 407);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 408
 */
export class RequestTimeoutError extends HttpError {
  constructor(message: string = "Request timeout") {
    super(message, 408);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 409
 */
export class ConflictError extends HttpError {
  constructor(message: string = "Conflict") {
    super(message, 409);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 410
 */
export class GoneError extends HttpError {
  constructor(message: string = "Gone") {
    super(message, 410);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 411
 */
export class LengthRequiredError extends HttpError {
  constructor(message: string = "Length required") {
    super(message, 411);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 412
 */
export class PreconditionFailedError extends HttpError {
  constructor(message: string = "Precondition failed") {
    super(message, 412);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 413
 */
export class PayloadTooLargeError extends HttpError {
  constructor(message: string = "Payload too large") {
    super(message, 413);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 414
 */
export class UriTooLongError extends HttpError {
  constructor(message: string = "URI too long") {
    super(message, 414);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 415
 */
export class UnsupportedMediaTypeError extends HttpError {
  constructor(message: string = "Unsupported media type") {
    super(message, 415);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 416
 */
export class RangeNotSatisfiableError extends HttpError {
  constructor(message: string = "Range not satisfiable") {
    super(message, 416);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 417
 */
export class ExpectationFailedError extends HttpError {
  constructor(message: string = "Expectation failed") {
    super(message, 417);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 418
 */
export class ImATeapotError extends HttpError {
  constructor(message: string = "I'm a teapot") {
    super(message, 418);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 422
 */
export class UnprocessableEntityError extends HttpError {
  constructor(message: string = "Unprocessable entity") {
    super(message, 422);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 429
 */
export class TooManyRequestsError extends HttpError {
  constructor(message: string = "Too many requests") {
    super(message, 429);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 431
 */
export class RequestHeaderFieldsTooLargeError extends HttpError {
  constructor(message: string = "Request header fields too large") {
    super(message, 431);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 451
 */
export class UnavailableForLegalReasonsError extends HttpError {
  constructor(message: string = "Unavailable for legal reasons") {
    super(message, 451);
  }
}
// #endregion

// #region HttpError 5XX
/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 500
 */
export class InternalServerError extends HttpError {
  constructor(message: string = "Internal server error") {
    super(message, 500);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 501
 */
export class NotImplementedError extends HttpError {
  constructor(message: string = "Not implemented") {
    super(message, 501);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 502
 */
export class BadGatewayError extends HttpError {
  constructor(message: string = "Bad gateway") {
    super(message, 502);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 503
 */
export class ServiceUnavailableError extends HttpError {
  constructor(message: string = "Service unavailable") {
    super(message, 503);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 504
 */
export class GatewayTimeoutError extends HttpError {
  constructor(message: string = "Gateway timeout") {
    super(message, 504);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 505
 */
export class HttpVersionNotSupportedError extends HttpError {
  constructor(message: string = "HTTP version not supported") {
    super(message, 505);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 507
 */
export class InsufficientStorageError extends HttpError {
  constructor(message: string = "Insufficient storage") {
    super(message, 507);
  }
}

/**
 * enfant de la class d'erreur httpError/child of the httpError class
 * @returns une erreur http avec un code d'erreur 511
 */
export class NetworkAuthenticationRequiredError extends HttpError {
  constructor(message: string = "Network authentication required") {
    super(message, 511);
  }
}

// #endregion