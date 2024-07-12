const { logger } = require('../utils/loggers');

const sendErrorDev = (error, res) => {
  const statusCode = error.statusCode || "error";
  const status = error.status || "error";
  const message = error.message;
  const stack = error.stack;
  logger.error(error)
  res.status(statusCode).json({
    status,
    message,
    stack,
  });
};

const sendErrorProd = (error, res) => {
  const statusCode = error.statusCode || "error";
  const status = error.status || "error";
  const message = error.message;
  const stack = error.stack;

  if (error.isOperational) {
    return res.status(statusCode).json({
      status,
      message,
    });
  }
  return res.status(500).json({
    status: "error",
    message: "something went wrong",
  });
};

const globalErrorHandler = (err, req, res, next) => {
  (err, req, res, next) => {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  };

  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, res);
  }

  sendErrorProd(err, res);
};

module.exports={globalErrorHandler}