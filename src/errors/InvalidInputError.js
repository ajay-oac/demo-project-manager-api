const { INVALID_INPUT_ERROR_CODE } = require("../constants/errorCodes");
const ApiError = require("./ApiError");

/**
 * Models 422 - Unprocessable Entity error.
 * To be used when received inputs are not valid.
 */
module.exports = class InvalidInputError extends ApiError {
  constructor(message) {
    super(message, null, 422, INVALID_INPUT_ERROR_CODE);
  }
};
