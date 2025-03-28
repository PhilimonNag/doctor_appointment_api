const { body } = require("express-validator");

module.exports = {
  doctorCreateValidator: [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("username is required")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage(
        "Username can only contain letters, numbers, and underscores"
      ),

    body("first_name").trim().notEmpty().withMessage("first_name is required"),

    body("last_name").trim().notEmpty().withMessage("last_name is required"),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("Invalid email format"),
  ],
};
