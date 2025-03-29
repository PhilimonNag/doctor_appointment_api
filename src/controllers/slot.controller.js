const moment = require("moment");
const RecurrenceRule = require("../models/recurrenceRule.model");
const Slot = require("../models/slot.model");
const Patient = require("../models/patient.model");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler.middleware");
const responseHandler = require("../utils/responseHandler");
const Booking = require("../models/booking.model");

exports.createRecurringSlots = asyncErrorHandler(async (req, res) => {
  const doctorId = req.params.doctorId;
  const {
    startTime,
    endTime,
    slotDuration,
    recurrenceType,
    repeatUntil,
    weekDays,
    oneTimeDate,
  } = req.body;

  // Validate start and end time
  if (
    !moment(startTime, moment.ISO_8601, true).isValid() ||
    !moment(endTime, moment.ISO_8601, true).isValid()
  ) {
    return responseHandler({
      res,
      success: false,
      message: "Invalid date format for startTime or endTime",
      statusCode: 400,
    });
  }

  if (
    oneTimeDate &&
    !moment.utc(oneTimeDate, moment.ISO_8601, true).isValid()
  ) {
    return responseHandler({
      res,
      success: false,
      message: "Invalid oneTime date format",
      statusCode: 400,
    });
  }

  // Convert times to UTC and extract HH:mm format
  const mStartTime = moment.utc(startTime).format("HH:mm");
  const mEndTime = moment.utc(endTime).format("HH:mm");

  let recurrenceRule = null;
  let slots = [];

  // Define recurrence rule
  if (recurrenceType === "daily") {
    recurrenceRule = `FREQ=DAILY;UNTIL=${moment
      .utc(repeatUntil)
      .format("YYYYMMDD")}T235959Z`;
  } else if (recurrenceType === "weekly" && weekDays && weekDays.length) {
    recurrenceRule = `FREQ=WEEKLY;BYDAY=${weekDays
      .join(",")
      .toUpperCase()};UNTIL=${moment
      .utc(repeatUntil)
      .format("YYYYMMDD")}T235959Z`;
  } else if (recurrenceType === "oneTime" && oneTimeDate) {
    recurrenceRule = null;
  } else {
    return responseHandler({
      res,
      success: false,
      message: "Invalid recurrence configuration",
      statusCode: 400,
    });
  }

  // Create recurrence rule entry
  const newRecurrence = await RecurrenceRule.create({
    doctor: doctorId,
    startTime: mStartTime,
    endTime: mEndTime,
    slotDuration,
    recurrenceType,
    recurrenceRule: recurrenceRule,
    oneTimeDate: oneTimeDate ? moment.utc(oneTimeDate).toDate() : null,
  });

  // Determine start and end dates
  let currentDate =
    recurrenceType === "oneTime"
      ? moment.utc(oneTimeDate).startOf("day")
      : moment.utc(startTime).startOf("day");

  let endDate =
    recurrenceType === "oneTime"
      ? moment.utc(oneTimeDate).startOf("day")
      : moment.utc(repeatUntil).startOf("day");
  // console.log(currentDate, endDate);
  while (!currentDate.isAfter(endDate)) {
    // For weekly recurrence, check if the day matches
    if (
      recurrenceType === "weekly" &&
      !weekDays.includes(currentDate.format("ddd").toUpperCase())
    ) {
      currentDate.add(1, "day");
      continue;
    }

    let slotStart = moment.utc(
      `${currentDate.format("YYYY-MM-DD")}T${mStartTime}`,
      moment.ISO_8601,
      true
    );
    let slotEnd = moment.utc(
      `${currentDate.format("YYYY-MM-DD")}T${mEndTime}`,
      moment.ISO_8601,
      true
    );

    while (slotStart.isBefore(slotEnd)) {
      let slotEndTime = moment(slotStart).add(slotDuration, "minutes");
      if (slotEndTime.isAfter(slotEnd)) break;

      slots.push({
        doctor: doctorId,
        date: currentDate.toDate(),
        startTime: slotStart.format("HH:mm"),
        endTime: slotEndTime.format("HH:mm"),
        slotDuration,
        recurrenceRule: newRecurrence._id,
      });

      slotStart.add(slotDuration, "minutes");
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
      recurrenceId: newRecurrence._id,
    },
  });
});

exports.bookSlot = asyncErrorHandler(async (req, res) => {
  const slotId = req.params.slotId;
  const { firstName, lastName, reason, email, mobileNumber } = req.body;

  const availableSlot = await Slot.findOneAndUpdate(
    { _id: slotId, status: "available" },
    { status: "booked" },
    { new: true }
  );

  if (!availableSlot) {
    return responseHandler({
      res,
      success: false,
      message: "Slot not available",
      statusCode: 400,
    });
  }

  let patient = await Patient.findOne({ email });

  if (!patient) {
    patient = await Patient.create({
      firstName,
      lastName,
      email,
      mobileNumber,
    });
  }

  const bookingTime = new Date();
  const newBooking = await Booking.create({
    reason,
    patient: patient._id,
    slot: availableSlot._id,
    bookingTime: bookingTime,
  });

  return responseHandler({
    res,
    success: true,
    message: "Slot booked successfully",
    data: {
      bookingId: newBooking._id,
      bookingTime: bookingTime,
      patient: {
        name: `${patient.firstName} ${patient.lastName}`,
        email: patient.email,
        mobileNumber: patient.mobileNumber,
      },
      slot: {
        startTime: availableSlot.startTime,
        endTime: availableSlot.endTime,
        date: availableSlot.date,
        status: availableSlot.status,
      },
    },
  });
});
