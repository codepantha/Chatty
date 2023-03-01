const { StatusCodes } = require('http-status-codes');
const CustomApiError = require('../errors/CustomAPI');

const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something bad happened. Please try later.'
  };

  if (err instanceof CustomApiError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }

  // TODO: database-related errors
  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = `${field} ${err.keyValue[field]} already exists. Please choose another.`;

    return res
      .status(customError.statusCode)
      .json({ msg: customError.message });
  }

  return res.status(customError.statusCode).json({ msg: customError.message });
};

module.exports = errorHandlerMiddleware;
