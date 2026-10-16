import { ServerStatus, ServerCode, ServerStatuses } from "./status";

export enum ErrorSystem { system = 'system' };
export type ErrorSystemType = `${ErrorSystem}`;
export enum ErrorServer {
	amq = 'amqp',
	http = 'http',
	grpc = 'grpc',
	tcp = 'tcp',
	udp = 'udp',
	websocket = 'websocket',
}
export type ErrorServerType = `${ErrorServer}`;
export type ErrorType = ErrorServerType | ErrorSystemType;

export interface IException {
	type?: string;
	code?: number;
	details?: any;
	original?: Exception;
}

export type ExceptionConstructor = new (
	msg?: string,
	details?: any,
	original?: Error
) => IException;

export class Exception extends Error implements IException {
	constructor(
		msg?: string,
		public type?: string,
		public code?: number,
		public details?: any,
		public original?: Exception,
	) { super(msg); }

	static from(error: Error, type?: ErrorType, code?: number, details?: any,) {
		return new Exception(error.message, type, code, details);
	}
}

export interface SystemException extends IException {
	type?: ErrorSystemType;
}

export type SystemExceptionConstructor =
	() => (new (msg?: string, details?: any, original?: Error) => SystemException);

export interface ServerException extends IException {
	type?: string;
	status?: string;
	statusCode?: string;
}

export type ServerExceptionConstructor =
	(new (msg?: string, details?: any, original?: Error) => Exception);