const pool = require("../config/dbConfig");
const {
  FAILED_TO_GET_USERNAME_PASSWORD_MESSAGE,
  FAILED_TO_SAVE_REFRESH_TOKEN_MESSAGE,
  FAILED_TO_GET_REFRESH_TOKEN_MESSAGE,
  FAILED_TO_ADD_ACCOUNT_MESSAGE,
  FAILED_TO_DELETE_REFRESH_TOKEN_MESSAGE,
  FAILED_TO_GET_USERNAME_MESSAGE,
} = require("../constants/messageConstants");
const {
  GET_PASSWORD_IMAGE_QUERY,
  SAVE_REFRESH_TOKEN_QUERY,
  GET_REFRESH_TOKEN_QUERY,
  INSERT_ACCOUNT_QUERY,
  DELETE_REFRESH_TOKEN_QUERY,
  GET_USERNAME_QUERY,
} = require("../constants/queryConstants");
const { withDbErrorHandling } = require("../helpers/withErrorHandling");

/**
 * Gets password and image for a user by their username.
 * Return the row if found else null.
 */
exports.getPasswordAndImage = withDbErrorHandling(async (username) => {
  const { rows } = await pool.query(GET_PASSWORD_IMAGE_QUERY, [username]);
  return rows.length ? rows[0] : null;
}, FAILED_TO_GET_USERNAME_PASSWORD_MESSAGE);

/**
 * Saves refresh token for a user by their username.
 */
exports.saveRefreshToken = withDbErrorHandling(
  async (refreshToken, username) => {
    pool.query(SAVE_REFRESH_TOKEN_QUERY, [refreshToken, username]);
  },
  FAILED_TO_SAVE_REFRESH_TOKEN_MESSAGE
);

/**
 * Verifies if the refresh token is present in DB.
 * Returns a boolean indicating if the token is present in DB or not.
 */
exports.validateRefreshTokenAgainDb = withDbErrorHandling(
  async (refreshToken) => {
    const { rows } = await pool.query(GET_REFRESH_TOKEN_QUERY, [refreshToken]);
    return !!rows.length;
  },
  FAILED_TO_GET_REFRESH_TOKEN_MESSAGE
);

/**
 * Inserts a new account in DB.
 */
exports.addAccount = withDbErrorHandling(async (username, password) => {
  await pool.query(INSERT_ACCOUNT_QUERY, [username, password]);
}, FAILED_TO_ADD_ACCOUNT_MESSAGE);

/**
 * Sets the refresh token as null.
 */
exports.deleteRefreshToken = withDbErrorHandling(async (refreshToken) => {
  await pool.query(DELETE_REFRESH_TOKEN_QUERY, [refreshToken]);
}, FAILED_TO_DELETE_REFRESH_TOKEN_MESSAGE);

/**
 * Verifies if the username is already present in DB.
 * Return a boolean indicating if a record was found with the provided username.
 */
exports.validateUsernameAgainstDb = withDbErrorHandling(async (username) => {
  const { rows } = await pool.query(GET_USERNAME_QUERY, [username]);
  return !!rows.length;
}, FAILED_TO_GET_USERNAME_MESSAGE);
