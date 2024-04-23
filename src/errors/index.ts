export class CustomError extends Error {
  statusCode: number;
  statusMessage: string;

  constructor(name: string, message: string, statusCode: number) {
    super();
    this.name = name;
    this.statusMessage = message;
    this.statusCode = statusCode;
  }
}

export class DoesNotExistError extends CustomError {
  constructor(message: string) {
    super("DoesNotExistError", message, 401);
  }
}

export class AlreadyExistsError extends CustomError {
  constructor(message: string) {
    super("AlreadyExistsError", message, 409);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string) {
    super("ForbiddenError", message, 403);
  }
}

export class ServiceUnavailableError extends CustomError {
  constructor(message: string) {
    super("ServiceUnavailableError", message, 503);
  }
}

export class InvalidDataError extends CustomError {
  constructor(message: string) {
    super("InvalidDataError", message, 400);
  }
}
