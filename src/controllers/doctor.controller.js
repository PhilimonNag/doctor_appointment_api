const responseHandler = require("../utils/responseHandler");
const Doctor = require("../models/doctor.model");
const Slot = require("../models/slot.model");
const Booking = require("../models/booking.model");
const moment = require("moment");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler.middleware");
const { Result } = require("express-validator");

const createDoctor = asyncErrorHandler(async (req, res) => {
  const { userName, firstName, lastName, email } = req.body;

  const doctor = await Doctor.create({
    userName,
    firstName,
    lastName,
    email,
  });

  return responseHandler({
    res,
    success: true,
    message: "Doctor created successfully",
    data: doctor,
  });
});

const getBookedAppointments = asyncErrorHandler(async (req, res) => {
  const { doctorId } = req.params;
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return responseHandler({
      res,
      success: false,
      message: "startDate and endDate are required",
      statusCode: 400,
    });
  }

  const mStartDate = new Date(startDate);
  const mEndDate = new Date(endDate);
  const bookedAppointments = await Booking.find({
    bookingTime: { $gte: mStartDate, $lte: mEndDate },
  })
    .populate({
      path: "slot",
      match: { doctor: doctorId },
      select: "startTime endTime",
    })
    .populate("patient", "firstName lastName email mobileNumber")
    .lean();

  const filteredAppointments = bookedAppointments.filter(
    (booking) => booking.slot !== null
  );

  if (filteredAppointments.length > 0)
    responseHandler({
      res,
      success: true,
      message: "Booking Founds",
      data: {
        count: filteredAppointments.length,
        result: filteredAppointments,
      },
    });
  else
    return responseHandler({
      res,
      success: false,
      message: "No booking founds",
      statusCode: 400,
    });
});

const getAvailableSlots = asyncErrorHandler(async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query;

  if (!date) {
    return responseHandler({
      res,
      message: "date is required",
      success: false,
      statusCode: 400,
    });
  }
  const queryDate = moment(date).startOf("day").toDate();
  let exactDate = moment(queryDate).add(1, "day").toDate();
  // console.log("Query Date:", queryDate, exactDate);
  const availableSlots = await Slot.find({
    doctor: doctorId,
    date: exactDate,
    status: "available",
  }).select("startTime endTime date");

  if (availableSlots.length > 0)
    return responseHandler({
      res,
      success: true,
      message: "Slots Available",
      data: {
        counts: availableSlots.length,
        result: availableSlots,
      },
    });
  else
    return responseHandler({
      res,
      success: false,
      statusCode: 400,
      message: "Slots Not Found",
    });
});

module.exports = { createDoctor, getBookedAppointments, getAvailableSlots };
