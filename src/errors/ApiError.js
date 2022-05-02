/**
 * Models all the erros that the APIs can throw.
 */
module.exports = class ApiError {
  constructor(message, source, httpStatusCode, errorCode) {
    this.message = message;
    this.source = source;
    this.httpStatusCode = httpStatusCode;
    this.errorCode = errorCode;
  }

  getErrorObjectForHttpResponse() {
    return {
      message: this.message,
      code: this.errorCode,
    };
  }
};
