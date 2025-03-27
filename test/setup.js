const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.test" });
beforeAll(async () => {
  console.log("Before all tests");
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  console.log("After all tests");
  await mongoose.connection.close();
});
