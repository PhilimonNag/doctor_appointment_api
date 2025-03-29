const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "userName is required"],
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, "firstName is required"],
    },
    lastName: {
      type: String,
      required: [true, "lastName is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
