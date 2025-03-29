const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "FirstName is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "LastName is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      unique: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
