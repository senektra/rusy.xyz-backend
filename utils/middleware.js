import morgan from "morgan";
import { createError } from "./errors.js";
import config from "./config.js";

const morganLogger = morgan(config.morganFormat, {
  skip: (_req, _res) => {
    if (config.env === "testing") return true;
  },
});

const nonApiErrorHandler = (err, req, res, next) => {
  switch (err.name) {
    case "CastError":
      next(createError(400, err.name, `Invalid ${err.kind}: ${err.value}`));
      break;
    case "ValidationError":
      next(createError(400, err.name, Object.values(err.errors)[0].message));
      break;
    case "JsonWebTokenError":
      next(createError(400, err.name, "Token missing or invalid"));
      break;
    case "TokenExpiredError":
      next(createError(401, err.name, "Token has expired"));
      break;
    case "SyntaxError":
      next(createError(400, err.name, "Malformed request"));
      break;
    default:
      next(err);
  }
};

const errorHandler = (err, _req, res, _next) => {
  res.status(err.status || 500).json(err);
};

export default { nonApiErrorHandler, errorHandler, morganLogger };
