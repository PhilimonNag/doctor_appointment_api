const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      error: errors.array()[0]["msg"],
      statusCode: 400,
    });
  }
  next();
};

module.exports = validate;
