import { Exception, ServerException } from "./exception";
import { ServerStatus } from "./status";

export class BadRequestError extends Exception implements ServerException {
	status = 'BadRequest';
	statusCode = `${ServerStatus['BadRequest']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['BadRequest'], details, original);
	}
}

export class UnauthorizedError extends Exception implements ServerException {
	status = 'Unauthorized';
	statusCode = `${ServerStatus['Unauthorized']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['Unauthorized'], details, original);
	}
}

export class PaymentRequiredError extends Exception implements ServerException {
	status = 'PaymentRequired';
	statusCode = `${ServerStatus['PaymentRequired']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['PaymentRequired'], details, original);
	}
}

export class ForbiddenError extends Exception implements ServerException {
	status = 'Forbidden';
	statusCode = `${ServerStatus['Forbidden']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['Forbidden'], details, original);
	}
}

export class NotFoundError extends Exception implements ServerException {
	status = 'NotFound';
	statusCode = `${ServerStatus['NotFound']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['NotFound'], details, original);
	}
}

export class MethodNotAllowedError extends Exception implements ServerException {
	status = 'MethodNotAllowed';
	statusCode = `${ServerStatus['MethodNotAllowed']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['MethodNotAllowed'], details, original);
	}
}

export class NotAcceptableError extends Exception implements ServerException {
	status = 'NotAcceptable';
	statusCode = `${ServerStatus['NotAcceptable']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['NotAcceptable'], details, original);
	}
}

export class ProxyAuthenticationRequiredError extends Exception implements ServerException {
	status = 'ProxyAuthenticationRequired';
	statusCode = `${ServerStatus['ProxyAuthenticationRequired']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['ProxyAuthenticationRequired'], details, original);
	}
}

export class RequestTimeoutError extends Exception implements ServerException {
	status = 'RequestTimeout';
	statusCode = `${ServerStatus['RequestTimeout']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['RequestTimeout'], details, original);
	}
}

export class ConflictError extends Exception implements ServerException {
	status = 'Conflict';
	statusCode = `${ServerStatus['Conflict']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['Conflict'], details, original);
	}
}

export class GoneError extends Exception implements ServerException {
	status = 'Gone';
	statusCode = `${ServerStatus['Gone']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['Gone'], details, original);
	}
}

export class LengthRequiredError extends Exception implements ServerException {
	status = 'LengthRequired';
	statusCode = `${ServerStatus['LengthRequired']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['LengthRequired'], details, original);
	}
}

export class PreconditionFailedError extends Exception implements ServerException {
	status = 'PreconditionFailed';
	statusCode = `${ServerStatus['PreconditionFailed']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['PreconditionFailed'], details, original);
	}
}

export class PayloadTooLargeError extends Exception implements ServerException {
	status = 'PayloadTooLarge';
	statusCode = `${ServerStatus['PayloadTooLarge']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['PayloadTooLarge'], details, original);
	}
}

export class URITooLongError extends Exception implements ServerException {
	status = 'URITooLong';
	statusCode = `${ServerStatus['URITooLong']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['URITooLong'], details, original);
	}
}

export class UnsupportedMediaTypeError extends Exception implements ServerException {
	status = 'UnsupportedMediaType';
	statusCode = `${ServerStatus['UnsupportedMediaType']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['UnsupportedMediaType'], details, original);
	}
}

export class RangeNotSatisfiableError extends Exception implements ServerException {
	status = 'RangeNotSatisfiable';
	statusCode = `${ServerStatus['RangeNotSatisfiable']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['RangeNotSatisfiable'], details, original);
	}
}

export class ExpectationFailedError extends Exception implements ServerException {
	status = 'ExpectationFailed';
	statusCode = `${ServerStatus['ExpectationFailed']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['ExpectationFailed'], details, original);
	}
}

export class MisdirectedRequestError extends Exception implements ServerException {
	status = 'MisdirectedRequest';
	statusCode = `${ServerStatus['MisdirectedRequest']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['MisdirectedRequest'], details, original);
	}
}

export class UnprocessableEntityError extends Exception implements ServerException {
	status = 'UnprocessableEntity';
	statusCode = `${ServerStatus['UnprocessableEntity']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['UnprocessableEntity'], details, original);
	}
}

export class LockedError extends Exception implements ServerException {
	status = 'Locked';
	statusCode = `${ServerStatus['Locked']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['Locked'], details, original);
	}
}

export class FailedDependencyError extends Exception implements ServerException {
	status = 'FailedDependency';
	statusCode = `${ServerStatus['FailedDependency']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['FailedDependency'], details, original);
	}
}

export class TooEarlyError extends Exception implements ServerException {
	status = 'TooEarly';
	statusCode = `${ServerStatus['TooEarly']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['TooEarly'], details, original);
	}
}

export class UpgradeRequiredError extends Exception implements ServerException {
	status = 'UpgradeRequired';
	statusCode = `${ServerStatus['UpgradeRequired']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['UpgradeRequired'], details, original);
	}
}

export class PreconditionRequiredError extends Exception implements ServerException {
	status = 'PreconditionRequired';
	statusCode = `${ServerStatus['PreconditionRequired']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['PreconditionRequired'], details, original);
	}
}

export class TooManyRequestsError extends Exception implements ServerException {
	status = 'TooManyRequests';
	statusCode = `${ServerStatus['TooManyRequests']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['TooManyRequests'], details, original);
	}
}

export class RequestHeaderFieldsTooLargeError extends Exception implements ServerException {
	status = 'RequestHeaderFieldsTooLarge';
	statusCode = `${ServerStatus['RequestHeaderFieldsTooLarge']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['RequestHeaderFieldsTooLarge'], details, original);
	}
}

export class UnavailableForLegalReasonsError extends Exception implements ServerException {
	status = 'UnavailableForLegalReasons';
	statusCode = `${ServerStatus['UnavailableForLegalReasons']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['UnavailableForLegalReasons'], details, original);
	}
}

export class InternalServerErrorException extends Exception implements ServerException {
	status = 'InternalServerErrorException';
	statusCode = `${ServerStatus['InternalServerErrorException']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['InternalServerErrorException'], details, original);
	}
}

export class NotImplementedError extends Exception implements ServerException {
	status = 'NotImplemented';
	statusCode = `${ServerStatus['NotImplemented']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['NotImplemented'], details, original);
	}
}

export class BadGatewayError extends Exception implements ServerException {
	status = 'BadGateway';
	statusCode = `${ServerStatus['BadGateway']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['BadGateway'], details, original);
	}
}

export class ServiceUnavailableError extends Exception implements ServerException {
	status = 'ServiceUnavailable';
	statusCode = `${ServerStatus['ServiceUnavailable']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['ServiceUnavailable'], details, original);
	}
}

export class GatewayTimeoutError extends Exception implements ServerException {
	status = 'GatewayTimeout';
	statusCode = `${ServerStatus['GatewayTimeout']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['GatewayTimeout'], details, original);
	}
}

export class HTTPVersionNotSupportedError extends Exception implements ServerException {
	status = 'HTTPVersionNotSupported';
	statusCode = `${ServerStatus['HTTPVersionNotSupported']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['HTTPVersionNotSupported'], details, original);
	}
}

export class VariantAlsoNegotiatesError extends Exception implements ServerException {
	status = 'VariantAlsoNegotiates';
	statusCode = `${ServerStatus['VariantAlsoNegotiates']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['VariantAlsoNegotiates'], details, original);
	}
}

export class InsufficientStorageError extends Exception implements ServerException {
	status = 'InsufficientStorage';
	statusCode = `${ServerStatus['InsufficientStorage']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['InsufficientStorage'], details, original);
	}
}

export class LoopDetectedError extends Exception implements ServerException {
	status = 'LoopDetected';
	statusCode = `${ServerStatus['LoopDetected']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['LoopDetected'], details, original);
	}
}

export class NotExtendedError extends Exception implements ServerException {
	status = 'NotExtended';
	statusCode = `${ServerStatus['NotExtended']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['NotExtended'], details, original);
	}
}

export class NetworkAuthenticationRequiredError extends Exception implements ServerException {
	status = 'NetworkAuthenticationRequired';
	statusCode = `${ServerStatus['NetworkAuthenticationRequired']}`;
	constructor(msg?: string, details?: any, original?: Error) {
		super(msg, undefined, ServerStatus['NetworkAuthenticationRequired'], details, original);
	}
}
