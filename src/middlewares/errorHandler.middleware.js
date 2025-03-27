const responseHandler = require("../utils/responseHandler");

const errorHandler = (err, req, res, next) => {
  return responseHandler({
    res,
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    statusCode: err.statusCode || 500,
  });
};

module.exports = errorHandler;
