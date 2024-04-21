const createUserError = (status, message) =>
  createError(status, "UserError", message);

export const createError = (status, name, message) => {
  return {
    status,
    name,
    message,
  };
};

export const userError = {
  noUsername: createUserError(400, "No username provided"),
  usernameTaken: createUserError(400, "Username is taken"),
  usernameTooShort: createUserError(400, "Username is too short"),
  noPassword: createUserError(400, "No password provided"),
  passwordTooShort: createUserError(400, "Password is too short"),
  badLogin: createUserError(403, "Invalid username or password"),
  userNotAuthorized: createUserError(401, "Invalid access token"),
  userNotAllowed: createUserError(403, "User forbidden"),
};
