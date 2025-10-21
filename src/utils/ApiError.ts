import { StatusCodes } from 'http-status-codes';

export class ApiError extends Error {
  code: number;
  errors: Record<string, string[]>;
  constructor(code: number, message: string, rawErrors?: Record<string, string[]>) {
    super(message);
    this.code = code;
    if (rawErrors) this.errors = rawErrors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends ApiError {
  constructor(path: string) {
    super(StatusCodes.NOT_FOUND, `La ruta ${path} no existe`);
  }
}

export class NotFoundObjectError extends ApiError {
  constructor(message: string) {
    super(StatusCodes.NOT_FOUND, message);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string, errors?: Record<string, string[]>) {
    super(StatusCodes.BAD_REQUEST, message, errors);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(meesage = 'No autorizado') {
    super(StatusCodes.UNAUTHORIZED, meesage);
  }
}

export class AplicationError extends ApiError {
  constructor(message: string, errors?: Record<string, string[]>) {
    super(StatusCodes.BAD_REQUEST, message, errors);
  }
}
