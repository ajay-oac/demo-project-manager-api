const jwt = require("jsonwebtoken");

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

/**
 * A wrapper over jwt.sign().
 * Returns a promise so that the consuming function can await for jwt.sign().
 */
exports.generateToken = (payload, tokenConfig, isAccessToken = true) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      isAccessToken ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET,
      tokenConfig,
      (err, token) => (err ? reject(err) : resolve(token))
    );
  });
};

/**
 * A wrapper over jwt.verify().
 * Returns a promise so that the consuming function can await for jwt.verify().
 */
exports.verifyToken = (token, isAccessToken = true) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      isAccessToken ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET,
      (err, decodedPayload) => (err ? reject(err) : resolve(decodedPayload))
    );
  });
};
