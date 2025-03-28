const moment = require("moment");
const RecurrenceRule = require("../models/recurrenceRule.model");
const Slot = require("../models/slot.model");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler.middleware");
const responseHandler = require("../utils/responseHandler");
exports.createRecurringSlots = asyncErrorHandler(async (req, res) => {
  const doctorId = req.params.doctorId;
  const {
    start_time,
    end_time,
    slot_duration,
    recurrence_type,
    repeat_until,
    weekdays,
    one_time_date,
  } = req.body;

  // Ensure valid timestamps
  if (
    !moment(start_time, moment.ISO_8601, true).isValid() ||
    !moment(end_time, moment.ISO_8601, true).isValid()
  ) {
    return responseHandler({
      res,
      success: false,
      message: "Invalid date format",
      statusCode: 400,
    });
  }

  // Convert to UTC and extract only HH:mm
  const startTime = moment.utc(start_time).format("HH:mm");
  const endTime = moment.utc(end_time).format("HH:mm");

  let recurrenceRule = null;
  let slots = [];

  if (recurrence_type === "daily") {
    recurrenceRule = `FREQ=DAILY;UNTIL=${moment
      .utc(repeat_until)
      .format("YYYYMMDD")}T235959Z`;
  } else if (recurrence_type === "weekly" && weekdays && weekdays.length) {
    recurrenceRule = `FREQ=WEEKLY;BYDAY=${weekdays
      .join(",")
      .toUpperCase()};UNTIL=${moment
      .utc(repeat_until)
      .format("YYYYMMDD")}T235959Z`;
  } else if (recurrence_type === "one-time" && one_time_date) {
    recurrenceRule = null;
  } else {
    return responseHandler({
      res,
      success: false,
      message: "Invalid recurrence configuration",
      statusCode: 400,
    });
  }

  const newRecurrence = await RecurrenceRule.create({
    doctor: doctorId,
    start_time: startTime,
    end_time: endTime,
    slot_duration,
    recurrence_type,
    recurrence_rule: recurrenceRule,
    one_time_date: one_time_date ? moment.utc(one_time_date).toDate() : null,
  });

  let currentDate =
    recurrence_type === "one-time"
      ? moment(one_time_date).startOf("day")
      : moment(start_time).startOf("day");

  let endDate =
    recurrence_type === "one-time"
      ? moment(one_time_date).startOf("day")
      : moment(repeat_until).startOf("day");

  // console.log(currentDate, endDate);
  while (!currentDate.isAfter(endDate)) {
    if (
      recurrence_type === "weekly" &&
      !weekdays.includes(currentDate.format("dd").toUpperCase())
    ) {
      currentDate.add(1, "day");
      continue;
    }

    let slotStart = moment(`${currentDate.format("YYYY-MM-DD")}T${startTime}`);
    let slotEnd = moment(`${currentDate.format("YYYY-MM-DD")}T${endTime}`);
    // console.log(`${slotStart} - ${slotEnd}`);
    while (slotStart.isBefore(slotEnd)) {
      let slotEndTime = moment(slotStart).add(slot_duration, "minutes");
      if (slotEndTime.isAfter(slotEnd)) break;

      slots.push({
        doctor: doctorId,
        date: currentDate.toDate(),
        start_time: slotStart.format("HH:mm"),
        end_time: slotEndTime.format("HH:mm"),
        // start_time: slotStart.toDate(),
        // end_time: slotEndTime.toDate(),
        slot_duration,
        recurrence_rule: newRecurrence._id,
      });

      slotStart.add(slot_duration, "minutes");
    }

    currentDate.add(1, "day");
  }

  // console.log(slots);
  await Slot.insertMany(slots);

  return responseHandler({
    res,
    success: true,
    message: "Slots created successfully",
    data: {
      recurrence_id: newRecurrence._id,
    },
  });
});
