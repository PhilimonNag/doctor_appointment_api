const router = require("express").Router();
router.use("/doctors", require("./doctor.route"));
module.exports = router;
