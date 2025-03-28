const responseHandler = require("../utils/responseHandler");
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle MongoDB Duplicate Key Error (E11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    message = `The ${field} '${err.keyValue[field]}' is already taken. Please use a different ${field}.`;
  }

  return responseHandler({
    res,
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? err.stack : null,
    statusCode,
  });
};

module.exports = errorHandler;
