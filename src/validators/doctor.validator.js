const { body } = require("express-validator");

module.exports = {
  doctorCreateValidator: [
    body("userName")
      .trim()
      .notEmpty()
      .withMessage("userName is required")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage(
        "Username can only contain letters, numbers, and underscores"
      ),

    body("firstName").trim().notEmpty().withMessage("firstName is required"),

    body("lastName").trim().notEmpty().withMessage("lastName is required"),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("Invalid email format"),
  ],
};
