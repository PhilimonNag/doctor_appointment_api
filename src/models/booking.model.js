const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    bookingTime: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
