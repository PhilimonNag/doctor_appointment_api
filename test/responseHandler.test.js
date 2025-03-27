const responseHandler = require("../src/utils/responseHandler");

describe("Response Handler", () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("should return success response with data", () => {
    responseHandler({
      res: mockRes,
      success: true,
      message: "Success",
      data: { id: 1, name: "Test" },
    });

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: "Success",
      data: { id: 1, name: "Test" },
    });
  });

  test("should return error response without null values", () => {
    responseHandler({
      res: mockRes,
      success: false,
      message: "An error occurred",
      error: "Error details",
      statusCode: 500,
    });

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: "An error occurred",
      error: "Error details",
    });
  });

  test("should remove null values from response", () => {
    responseHandler({
      res: mockRes,
      success: true,
      message: "No data",
      data: null,
    });

    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: "No data",
    });
  });
});
