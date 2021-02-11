/**
 * @class ApplicationError
 * @description base error class for application
 * @extends Error
 */
class ApplicationError extends Error {
  /**
   * @description initializes the error class
   *
   * @param {number} statusCode status code of the request
   * @param {string} message error message
   * @param {array} errors an array containing errors
   */
  constructor(statusCode, message = 'an error occurred.', data) {
    super(message);
    this.statusCode = statusCode;
    this.status = 'error';
    this.message = message;
    this.data = data || null;
  }
}

class BadRequestError extends ApplicationError {
  /**
   * @description initialize error class
   *
   * @param {string} message error message
   */
  constructor(message, data) {
    super(400, message || 'Bad Request', data);
  }
}

class NotFoundError extends ApplicationError {
  /**
   * @description initialize error class
   *
   * @param {string} message error message
   */
  constructor(message, data) {
    super(404, message || 'Resource not found', data);
  }
}

module.exports = {
  ApplicationError,
  BadRequestError,
  NotFoundError,
};
