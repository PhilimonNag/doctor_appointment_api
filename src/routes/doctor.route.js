const router = require("express").Router();
const doctorController = require("../controllers/doctor.controller");
const validate = require("../middlewares/validation.middleware");
const { doctorCreateValidator } = require("../validators/doctor.validator");

router.post(
  "/",
  doctorCreateValidator,
  validate,
  doctorController.createDoctor
);
module.exports = router;
