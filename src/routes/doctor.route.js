const router = require("express").Router();
const doctorController = require("../controllers/doctor.controller");
const validate = require("../middlewares/validation.middleware");
const { doctorCreateValidator } = require("../validators/doctor.validator");
const slotController = require("../controllers/slot.controller");
const { createSlotValidator } = require("../validators/slot.validator");

router.post(
  "/",
  doctorCreateValidator,
  validate,
  doctorController.createDoctor
);
router.post(
  "/:doctorId/slots",
  createSlotValidator,
  validate,
  slotController.createRecurringSlots
);

router.get("/:doctorId/bookings", doctorController.getBookedAppointments);
router.get("/:doctorId/available_slots", doctorController.getAvailableSlots);
module.exports = router;
