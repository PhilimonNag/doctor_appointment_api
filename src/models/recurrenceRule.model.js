const mongoose = require("mongoose");

const recurrenceRuleSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  slot_duration: { type: Number, enum: [15, 30], required: true },
  recurrence_type: {
    type: String,
    enum: ["daily", "weekly", "one-time"],
    required: true,
  },
  recurrence_rule: { type: String, required: false },
  one_time_date: { type: Date, required: false },
});

const RecurrenceRule = mongoose.model("RecurrenceRule", recurrenceRuleSchema);
module.exports = RecurrenceRule;
