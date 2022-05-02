const { TOKEN_ERROR_CODE } = require("../constants/errorCodes");
const ApiError = require("./ApiError");

/**
 * Models errors that are throws when generating or verifying the tokens.
 */
module.exports = class TokenError extends ApiError {
  constructor(message, source, httpStatusCode) {
    super(message, source, httpStatusCode, TOKEN_ERROR_CODE);
  }
};
