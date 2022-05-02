const { NOT_AUTHORIZED_ERROR_CODE } = require("../constants/errorCodes");
const ApiError = require("./ApiError");

/**
 * Models 401 - Unauthorized errors.
 */
module.exports = class NotAuthorizedError extends ApiError {
  constructor(message) {
    super(message, null, 401, NOT_AUTHORIZED_ERROR_CODE);
  }
};
