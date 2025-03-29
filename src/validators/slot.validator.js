const { body, param } = require("express-validator");
const moment = require("moment");
const { bookSlot } = require("../controllers/slot.controller");

const isValidISODate = (value) =>
  moment(value, moment.ISO_8601, true).isValid();

module.exports = {
  createSlotValidator: [
    body("startTime")
      .exists()
      .withMessage("startTime is required")
      .custom(isValidISODate)
      .withMessage("startTime must be a valid ISO 8601 date"),

    body("endTime")
      .exists()
      .withMessage("endTime is required")
      .custom(isValidISODate)
      .withMessage("endTime must be a valid ISO 8601 date")
      .custom((value, { req }) => {
        if (moment.utc(value).isBefore(moment.utc(req.body.startTime))) {
          throw new Error("endTime must be after startTime");
        }
        return true;
      }),

    // Validate slotDuration (15 or 30 minutes)
    body("slotDuration")
      .exists()
      .withMessage("slotDuration is required")
      .isInt({ min: 15, max: 30 })
      .withMessage("slotDuration must be 15 or 30 minutes"),

    // Validate recurrenceType
    body("recurrenceType")
      .exists()
      .withMessage("recurrenceType is required")
      .isIn(["daily", "weekly", "oneTime"])
      .withMessage("Invalid recurrenceType"),

    // Validate repeatUntil for daily and weekly recurrence
    body("repeatUntil")
      .if(body("recurrenceType").isIn(["daily", "weekly"]))
      .exists()
      .withMessage("repeatUntil is required for daily and weekly recurrence")
      .custom(isValidISODate)
      .withMessage("repeatUntil must be a valid ISO 8601 date")
      .custom((value, { req }) => {
        if (moment.utc(value).isBefore(moment.utc(req.body.startTime))) {
          throw new Error("repeatUntil must be after startTime");
        }
        return true;
      }),

    // Validate weekDays for weekly recurrence
    body("weekDays")
      .if(body("recurrenceType").equals("weekly"))
      .exists()
      .withMessage("weekDays is required for weekly recurrence")
      .isArray()
      .withMessage("weekDays must be an array")
      .custom((value) => {
        const validDays = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
        if (!value.every((day) => validDays.includes(day.toUpperCase()))) {
          throw new Error(
            "weekDays must contain valid values (MO, TU, WE, TH, FR, SA, SU)"
          );
        }
        return true;
      }),

    // Validate oneTimeDate for oneTime recurrence
    body("oneTimeDate")
      .if(body("recurrenceType").equals("oneTime"))
      .exists()
      .withMessage("oneTimeDate is required for oneTime recurrence")
      .custom(isValidISODate)
      .withMessage("oneTimeDate must be a valid ISO 8601 date"),
    // Sanitize input
    body("startTime").trim(),
    body("endTime").trim(),
    body("repeatUntil").optional().trim(),
    body("oneTimeDate").optional().trim(),
  ],
  bookSlotValidator: [
    param("slotId")
      .exists()
      .withMessage("slotId is required")
      .isMongoId()
      .withMessage("Invalid slot ID format"),

    body("reason")
      .exists()
      .withMessage("Reason is required")
      .isLength({ min: 5, max: 200 })
      .withMessage("Reason must be between 5 and 200 characters")
      .trim(),

    body("firstName")
      .exists()
      .withMessage("firstName is required")
      .isLength({ min: 2, max: 50 })
      .withMessage("firstName must be between 2 and 50 characters")
      .trim(),

    body("lastName")
      .exists()
      .withMessage("lastName is required")
      .isLength({ min: 2, max: 50 })
      .withMessage("lastName must be between 2 and 50 characters")
      .trim(),

    body("email")
      .exists()
      .withMessage("email is required")
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(),

    body("mobileNumber")
      .exists()
      .withMessage("mobileNumber is required")
      .isMobilePhone()
      .withMessage("Invalid mobileNumber format"),
  ],
};
