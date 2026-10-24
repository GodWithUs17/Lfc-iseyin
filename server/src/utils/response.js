const sendSuccess = (res, statusCode = 200, data = null, meta = {}) => {
  return res.status(statusCode).json({
    success: true,
    data,
    meta,
  });
};

const sendError = (res, statusCode = 500, message = 'Something went wrong', details = null) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      details,
    },
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
