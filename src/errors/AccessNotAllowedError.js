const { ACCESS_NOT_ALLOWED_ERROR_CODE } = require("../constants/errorCodes");
const ApiError = require("./ApiError");

/**
 * Models 403 - Forbidden errors.
 */
module.exports = class AccessNotAllowedError extends ApiError {
  constructor(message) {
    super(message, null, 403, ACCESS_NOT_ALLOWED_ERROR_CODE);
  }
};
