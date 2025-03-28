const router = require("express").Router();
const slotController = require("../controllers/slot.controller");
const validate = require("../middlewares/validation.middleware");
const { bookSlotValidator } = require("../validators/slot.validator");

router.post(
  "/:slotId/book",
  bookSlotValidator,
  validate,
  slotController.bookSlot
);
module.exports = router;
