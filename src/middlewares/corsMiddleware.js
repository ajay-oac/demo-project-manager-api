/**
 * Middleware for setting CORS related headers on the response.
 * Need to allow credentials as we will receive access token in Authorization header.
 * And refresh token in Cookie header.
 */
module.exports = (req, res, next) => {
  const {
    origin: requestedOrigin,
    "access-control-request-headers": requestedHeaders,
    "access-control-request-method": requestedMethod,
  } = req.headers;

  requestedOrigin &&
    res.setHeader("access-control-allow-origin", requestedOrigin);

  requestedHeaders &&
    res.setHeader("access-control-allow-headers", requestedHeaders);

  requestedMethod &&
    res.setHeader("access-control-allow-methods", requestedMethod);

  res.setHeader("access-control-allow-credentials", "true");

  next();
};
