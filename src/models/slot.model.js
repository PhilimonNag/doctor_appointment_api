const mongoose = require("mongoose");

const recurrenceRuleSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  date: { type: Date, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  slot_duration: { type: Number, enum: [15, 30], required: true },
  status: {
    type: String,
    enum: ["available", "booked", "unavailable"],
    default: "available",
    required: true,
  },
  recurrence_rule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RecurrenceRule",
    required: true,
  },
});

const Slot = mongoose.model("Slot", recurrenceRuleSchema);
module.exports = Slot;
