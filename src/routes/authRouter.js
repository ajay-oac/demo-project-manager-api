const authRouter = require("express").Router();
const {
  loginController,
  refreshController,
  registerController,
  logoutController,
} = require("../controllers/authController");
const { withRouteErrorHandling } = require("../helpers/withErrorHandling");

/**
 * Router for handling all authentication requests.
 * Base URL: /api/v1/auth
 */

/**
 * Handles POST: /api/v1/auth/login route.
 */
authRouter.post("/login", withRouteErrorHandling(loginController));

/**
 * Handles GET: /api/v1/auth/refresh route.
 */
authRouter.get("/refresh", withRouteErrorHandling(refreshController));

/**
 * Handles POST: /api/v1/auth/register route.
 */
authRouter.post("/register", withRouteErrorHandling(registerController));

/**
 * Handles GET: /api/v1/auth/logout route.
 */
authRouter.get("/logout", withRouteErrorHandling(logoutController));

module.exports = authRouter;
