const debug = require('debug');
const { config } = require('dotenv');

const DEBUG = debug('dev');

config();

/**
 * @function
 * @description a wrapper controller for error handling
 *
 * @param {Object} err error object
 * @param {Object} request express request object
 * @param {Object} response express response object
 * @param {Function} next callback to call next middleware
 *
 * @returns {Object} response from the server
 */
module.exports = (err, request, response, next) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  let errorMessage = {};

  if (response.headersSent) {
    return next(err);
  }

  if (err instanceof SyntaxError && err.stack.includes('JSON.parse')) {
    err.message = 'Invalid JSON payload passed.';
    err.data = null;
  }

  errorMessage = err.stack;
  DEBUG(errorMessage);

  return response.status(err.statusCode || 500).json({
    message: err.message,
    status: 'error',
    data: err.data,
    ...(isDevelopment && { trace: errorMessage }),
  });
};
