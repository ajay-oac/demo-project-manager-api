const cookieParser = require("cookie-parser");
require("dotenv").config();
const express = require("express");
const { DEFAULT_ROUTE_MESSAGE } = require("./constants/messageConstants");
const ApiError = require("./errors/ApiError");
const corsMiddleware = require("./middlewares/corsMiddleware");
const apiRouter = require("./routes/apiRouter");

/**
 * Initializing the app and installing common middlewares.
 */
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);

/**
 * Send 200 for all preflight requests.
 */
const optionsRequestHandler = (req, res) => res.status(200).send();
app.options("/*", optionsRequestHandler);

/**
 * Route for API
 */
app.use("/api/v1", apiRouter);

/**
 * Default Route
 */
const globalDefaultRouteHandler = (req, res) =>
  res.status(404).json({ message: DEFAULT_ROUTE_MESSAGE });
app.use(globalDefaultRouteHandler);

/**
 * Global Error Handler
 */
const globalErrorHandler = (err, req, res, next) => {
  if (!(err instanceof ApiError))
    return res.status(500).json({ message: err.message });

  res.status(err.httpStatusCode).json(err.getErrorObjectForHttpResponse());
};
app.use(globalErrorHandler);

const port = process.env.PORT || 3032;
app.listen(port);
