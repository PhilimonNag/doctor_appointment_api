const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3000;

// Connect to MongoDB first, then start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => {
    process.exit(1); // Stop the process if DB connection fails
  });
