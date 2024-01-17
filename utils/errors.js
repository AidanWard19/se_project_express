const DEFAULT = 500;

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
    this.name = "BadRequestError";
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.status = 403;
    this.name = "ForbiddenError";
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
    this.name = "NotFoundError";
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
    this.name = "UnauthorizedError";
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.status = 409;
    this.name = "ConflictError";
  }
}

module.exports = {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  DEFAULT,
  UnauthorizedError,
  ConflictError,
};
