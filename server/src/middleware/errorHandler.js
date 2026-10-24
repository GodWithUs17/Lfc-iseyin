const { sendError } = require('../utils/response');

function notFoundHandler(req, res) {
  return sendError(res, 404, 'Route not found', {
    path: req.originalUrl,
    method: req.method,
  });
}

function globalErrorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  return sendError(res, statusCode, message, process.env.NODE_ENV === 'production' ? null : err.stack);
}

module.exports = {
  notFoundHandler,
  globalErrorHandler,
};
