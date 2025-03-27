const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
