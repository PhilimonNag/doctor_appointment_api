const request = require("supertest");
const app = require("../src/app");
describe("API Tests", () => {
  test("GET / should return API status", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "API is running...");
  });
});
