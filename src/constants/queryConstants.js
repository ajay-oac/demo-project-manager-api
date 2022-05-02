/**
 * Constants for querying the DB.
 */
module.exports = {
  GET_PASSWORD_IMAGE_QUERY:
    "SELECT password, user_image FROM account WHERE username=$1;",
  SAVE_REFRESH_TOKEN_QUERY:
    "UPDATE account SET refresh_token=$1 WHERE username=$2;",
  GET_REFRESH_TOKEN_QUERY:
    "SELECT refresh_token FROM account where refresh_token=$1;",
  INSERT_ACCOUNT_QUERY:
    "INSERT INTO account(username, password) VALUES($1, $2);",
  DELETE_REFRESH_TOKEN_QUERY:
    "UPDATE account SET refresh_token=null WHERE refresh_token=$1;",
  GET_USERNAME_QUERY: "SELECT username FROM account WHERE username=$1;",
};
