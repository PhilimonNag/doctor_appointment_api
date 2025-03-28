const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const errorHandler = require("./middlewares/errorHandler.middleware");
const setupSwagger = require("./config/swagger");
const routes = require("./routes/index");

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.send({ message: "API is running..." });
});
app.use("/api/v1", routes); // API routes
setupSwagger(app); // Swagger setup
app.use((req, res, next) => {
  const error = new Error("Not Found");
  res.status(404);
  next(error);
});
app.use(errorHandler); // Error handling middleware
module.exports = app;
