const responseHandler = require("../utils/responseHandler");
const Doctor = require("../models/doctor.model");
const Slot = require("../models/slot.model");
const Booking = require("../models/booking.model");
const moment = require("moment");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler.middleware");

const createDoctor = asyncErrorHandler(async (req, res) => {
  const { username, first_name, last_name, email } = req.body;

  const doctor = await Doctor.create({
    username,
    first_name,
    last_name,
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
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    return res
      .status(400)
      .json({ success: false, message: "Start and end dates are required" });
  }

  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const bookedAppointments = await Booking.find({
    booking_time: { $gte: startDate, $lte: endDate },
  })
    .populate({
      path: "slot",
      match: { doctor: doctorId },
      select: "start_time end_time",
    })
    .populate("patient", "first_name last_name email mobile_number")
    .lean();

  const filteredAppointments = bookedAppointments.filter(
    (booking) => booking.slot !== null
  );

  res.status(200).json({
    success: true,
    count: filteredAppointments.length,
    data: filteredAppointments,
  });
});

const getAvailableSlots = asyncErrorHandler(async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query;

  if (!date) {
    return res
      .status(400)
      .json({ success: false, message: "Date is required" });
  }
  const queryDate = moment(date).startOf("day").toDate();
  let exactDate = moment(queryDate).add(1, "day").toDate();
  // console.log("Query Date:", queryDate, exactDate);
  const availableSlots = await Slot.find({
    doctor: doctorId,
    date: exactDate,
    status: "available",
  }).select("start_time end_time date");

  res.status(200).json({
    success: true,
    count: availableSlots.length,
    data: availableSlots,
  });
});

module.exports = { createDoctor, getBookedAppointments, getAvailableSlots };
