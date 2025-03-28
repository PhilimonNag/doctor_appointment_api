const { body } = require("express-validator");
const moment = require("moment");

const isValidISODate = (value) =>
  moment(value, moment.ISO_8601, true).isValid();

module.exports = {
  createSlotValidator: [
    body("start_time")
      .exists()
      .withMessage("start_time is required")
      .custom(isValidISODate)
      .withMessage("start_time must be a valid ISO 8601 date"),

    body("end_time")
      .exists()
      .withMessage("end_time is required")
      .custom(isValidISODate)
      .withMessage("end_time must be a valid ISO 8601 date")
      .custom((value, { req }) => {
        if (moment.utc(value).isBefore(moment.utc(req.body.start_time))) {
          throw new Error("end_time must be after start_time");
        }
        return true;
      }),

    // Validate slot_duration (15 or 30 minutes)
    body("slot_duration")
      .exists()
      .withMessage("slot_duration is required")
      .isInt({ min: 15, max: 30 })
      .withMessage("slot_duration must be 15 or 30 minutes"),

    // Validate recurrence_type
    body("recurrence_type")
      .exists()
      .withMessage("recurrence_type is required")
      .isIn(["daily", "weekly", "one-time"])
      .withMessage("Invalid recurrence_type"),

    // Validate repeat_until for daily and weekly recurrence
    body("repeat_until")
      .if(body("recurrence_type").isIn(["daily", "weekly"]))
      .exists()
      .withMessage("repeat_until is required for daily and weekly recurrence")
      .custom(isValidISODate)
      .withMessage("repeat_until must be a valid ISO 8601 date")
      .custom((value, { req }) => {
        if (moment.utc(value).isBefore(moment.utc(req.body.start_time))) {
          throw new Error("repeat_until must be after start_time");
        }
        return true;
      }),

    // Validate weekdays for weekly recurrence
    body("weekdays")
      .if(body("recurrence_type").equals("weekly"))
      .exists()
      .withMessage("weekdays is required for weekly recurrence")
      .isArray()
      .withMessage("weekdays must be an array")
      .custom((value) => {
        const validDays = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
        if (!value.every((day) => validDays.includes(day.toUpperCase()))) {
          throw new Error(
            "weekdays must contain valid values (MO, TU, WE, TH, FR, SA, SU)"
          );
        }
        return true;
      }),

    // Validate one_time_date for one-time recurrence
    body("one_time_date")
      .if(body("recurrence_type").equals("one-time"))
      .exists()
      .withMessage("one_time_date is required for one-time recurrence")
      .custom(isValidISODate)
      .withMessage("one_time_date must be a valid ISO 8601 date"),
    // Sanitize input
    body("start_time").trim(),
    body("end_time").trim(),
    body("repeat_until").optional().trim(),
    body("one_time_date").optional().trim(),
  ],
};
