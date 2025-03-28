const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const port = process.env.PORT || 3000;
const hostedUrl = process.env.HOSTED_URL || `http://localhost:${port}`;
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Doctor Appointment API",
      version: "1.0.0",
      description: "API documentation for managing doctor slots and bookings",
    },
    servers: [
      { url: `http://localhost:${port}`, description: "Local server" },
      { url: hostedUrl, description: "Production server" },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
