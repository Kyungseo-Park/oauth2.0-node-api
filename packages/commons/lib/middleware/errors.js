class HttpError extends Error {
    constructor(message, code) {
      super(message);
      this.code = code;
    }
  }
  
  class NotFound extends HttpError {
    constructor(data) {
      super("NOT_FOUND", 404);
    }
  }
  
  class BadRequest extends HttpError {
    constructor(data) {
      super("BAD_REQUEST", 400);
      this.data = data;
    }
  }
  
  class Unauthorized extends HttpError {
    constructor(data) {
      super("UNAUTHORIZED", 401);
      this.data = data;
    }
  }
  
  class Forbidden extends HttpError {
    constructor(data) {
      super("FORBIDDEN", 403);
      this.data = data;
    }
  }
  
  class InternalServerError extends HttpError {
    constructor(data) {
      super("INTERNAL_SERVER_ERROR", 500);
      this.data = data;
    }
  }
  
  module.exports = {
    BadRequest,
    Unauthorized,
    Forbidden,
    InternalServerError,
    NotFound,
  };
  