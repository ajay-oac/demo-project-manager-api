const bcrypt = require("bcrypt");
const {
  INVALID_CREDENTIALS_MESSAGE,
  NOT_AUTHORIZED_MESSAGE,
  INVALID_TOKEN_MESSAGE,
  TOKEN_EXPIRED_MESSAGE,
  INVALID_INPUT_MESSAGE,
  LOGOUT_SUCCESS_MESSAGE,
  FAILED_TO_GENERATE_TOKEN_MESSAGE,
  USER_ALREADY_EXISTS_MESSAGE,
} = require("../constants/messageConstants");
const AccessNotAllowedError = require("../errors/AccessNotAllowedError");
const InvalidInputError = require("../errors/InvalidInputError");
const NotAuthorizedError = require("../errors/NotAuthorizedError");
const TokenError = require("../errors/TokenError");
const { generateToken, verifyToken } = require("../helpers/tokenHelper");
const {
  getPasswordAndImage,
  saveRefreshToken,
  validateRefreshTokenAgainDb,
  addAccount,
  deleteRefreshToken,
  validateUsernameAgainstDb,
} = require("../services/authService");

/**
 * Handle user login
 */
exports.loginController = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    throw new InvalidInputError(INVALID_INPUT_MESSAGE);

  // Validate received credentials against DB.
  const passwordAndImage = await getPasswordAndImage(username);
  if (!passwordAndImage)
    throw new NotAuthorizedError(INVALID_CREDENTIALS_MESSAGE);

  const { password: dbPassword, user_image: userImage } = passwordAndImage;
  const arePasswordsSame = await bcrypt.compare(password, dbPassword);

  if (!arePasswordsSame)
    throw new NotAuthorizedError(INVALID_CREDENTIALS_MESSAGE);

  // Generate access and refresh tokens if credentials are valid.
  let accessToken = "";
  let refreshToken = "";
  try {
    accessToken = await generateToken({ username }, { expiresIn: "1m" });
    refreshToken = await generateToken(
      { username },
      { expiresIn: "10m" },
      false
    );
  } catch (err) {
    throw new TokenError(FAILED_TO_GENERATE_TOKEN_MESSAGE, err, 500);
  }

  // Save refresh token in DB.
  saveRefreshToken(refreshToken, username);

  // Send basic account details and access token in response body and refresh token in httponly cookie.
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict"
  });
  res.status(200).json({ username, accessToken, userImage: userImage });
};

/**
 * Handle token refresh request.
 */
exports.refreshController = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) throw new NotAuthorizedError(NOT_AUTHORIZED_MESSAGE);

  // Verify if refresh token is present in DB as well.
  const isRefreshTokenInDb = await validateRefreshTokenAgainDb(refreshToken);
  if (!isRefreshTokenInDb) throw new NotAuthorizedError(INVALID_TOKEN_MESSAGE);

  // Validate the token.
  try {
    const { username } = await verifyToken(refreshToken, false);
    const accessToken = await generateToken({ username }, { expiresIn: "1m" });
    res.status(200).json({ accessToken });
  } catch (err) {
    throw new AccessNotAllowedError(TOKEN_EXPIRED_MESSAGE);
  }
};

/**
 * Handle user registration.
 */
exports.registerController = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    throw new InvalidInputError(INVALID_INPUT_MESSAGE);

  // Verify if username is not already taken.
  const isUsernameInDb = await validateUsernameAgainstDb(username);
  if (isUsernameInDb) throw new InvalidInputError(USER_ALREADY_EXISTS_MESSAGE);

  // Hash the password and add the user.
  const hashedPassword = await bcrypt.hash(password, 10);
  await addAccount(username, hashedPassword);
  res.status(201).json({ username });
};

/**
 * Handle user logout.
 */
exports.logoutController = async (req, res) => {
  // If refresh token is not sent don't need to explicitly logout.
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken)
    return res.status(200).json({ message: LOGOUT_SUCCESS_MESSAGE });

  // If received refresh token is not in DB, the user is already logged out.
  const isRefreshTokenInDb = await validateRefreshTokenAgainDb(refreshToken);
  if (!isRefreshTokenInDb)
    return res.status(200).json({ message: LOGOUT_SUCCESS_MESSAGE });

  // Delete the refresh token from DB if present in DB.
  await deleteRefreshToken(refreshToken);
  res.cookie("refreshToken", "", {
    httponly: true,
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });
  res.status(200).json({ message: LOGOUT_SUCCESS_MESSAGE });
};
