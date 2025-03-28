const responseHandler = require("../utils/responseHandler");
const Doctor = require("../models/doctor.model");
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

module.exports = { createDoctor };
