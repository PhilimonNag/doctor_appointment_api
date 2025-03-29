const mongoose = require("mongoose");

const recurrenceRuleSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  slotDuration: { type: Number, enum: [15, 30], required: true },
  recurrenceType: {
    type: String,
    enum: ["daily", "weekly", "oneTime"],
    required: true,
  },
  recurrenceRule: { type: String, required: false },
  oneTimeDate: { type: Date, required: false },
});

const RecurrenceRule = mongoose.model("RecurrenceRule", recurrenceRuleSchema);
module.exports = RecurrenceRule;
