const { StatusCodes } = require('http-status-codes');

class ResponseHelper {
  static success(res, message = 'Success', data = {}, statusCode = StatusCodes.OK) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res, message = 'Something went wrong', statusCode = StatusCodes.INTERNAL_SERVER_ERROR, error = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: error ? error.toString() : null,
    });
  }

  static validationError(res, errors, message = 'Validation Error') {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      success: false,
      message,
      errors,
    });
  }

  static unauthorized(res, message = 'Unauthorized') {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message,
    });
  }

  static forbidden(res, message = 'Forbidden') {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message,
    });
  }

  static notFound(res, message = 'Not Found') {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message,
    });
  }
}

module.exports = ResponseHelper;