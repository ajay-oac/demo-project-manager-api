const DatabaseError = require("../errors/DatabaseError");

/**
 * Provides error handling on top of route handlers.
 * Forwards the error thrown from route handlers to closest error handling middleware.
 */
exports.withRouteErrorHandling = (routeHandler) => {
  return async (req, res, next) => {
    try {
      await routeHandler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

/**
 * Provides error handling on top of services that utilize DB.
 * Creates a DatabaseError instance and sets the message to expected message.
 * Forwards the error thrown from such services to closest error handling middleware.
 */
exports.withDbErrorHandling = (callback, errorMessage) => {
  return async (...args) => {
    try {
      return await callback(...args);
    } catch (err) {
      throw new DatabaseError(errorMessage, err);
    }
  };
};
