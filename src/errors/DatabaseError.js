const { DB_ERROR_CODE } = require("../constants/errorCodes");
const ApiError = require("./ApiError");

/**
 * Models errors thrown from DB.
 */
module.exports = class DatabaseError extends ApiError {
  constructor(message, source) {
    super(message, source, 500, DB_ERROR_CODE);
  }
};
