const apiRouter = require("express").Router();
const authRouter = require("./authRouter");

/**
 * Base router for all API routes.
 * Base URL: /api/v1
 */

/**
 * Route all auth requests to authRouter.
 * Auth requests include register, login, logout and refresh.
 */
apiRouter.use("/auth", authRouter);

module.exports = apiRouter;
