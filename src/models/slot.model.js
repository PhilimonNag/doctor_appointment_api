const mongoose = require("mongoose");

const recurrenceRuleSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  slotDuration: { type: Number, enum: [15, 30], required: true },
  status: {
    type: String,
    enum: ["available", "booked", "unavailable"],
    default: "available",
    required: true,
  },
  recurrenceRule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RecurrenceRule",
    required: true,
  },
});

const Slot = mongoose.model("Slot", recurrenceRuleSchema);
module.exports = Slot;
