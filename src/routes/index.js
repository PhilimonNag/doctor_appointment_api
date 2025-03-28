const router = require("express").Router();
router.use("/doctors", require("./doctor.route"));
router.use("/slots", require("./slot.route"));
module.exports = router;
