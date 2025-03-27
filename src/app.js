const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const errorHandler = require("./middlewares/errorHandler.middleware");

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.send({ message: "API is running..." });
});

app.use((req, res, next) => {
  const error = new Error("Not Found");
  res.status(404);
  next(error);
});
app.use(errorHandler); // Error handling middleware
module.exports = app;
