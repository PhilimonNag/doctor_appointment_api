const cleanResponse = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined)
  );
};

const responseHandler = ({
  res,
  success,
  message,
  data = null,
  error = null,
  statusCode = 200,
}) => {
  if (data && typeof data.toObject === "function") {
    data = data.toObject();
  }

  if (data && typeof data === "object") {
    const { createdAt, updatedAt, __v, ...filteredData } = data;
    data = filteredData;
  }
  const response = cleanResponse({ success, message, data, error });
  return res.status(statusCode).json(response);
};

module.exports = responseHandler;
