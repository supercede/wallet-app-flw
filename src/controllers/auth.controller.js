const debug = require('debug');
const models = require('../models');
const { ApplicationError } = require('../utils/errors');
const { client } = require('../utils/redis');

const { users, wallets, sequelize } = models;
const DEBUG = debug('dev');

/**
 * @function createCookieAndToken
 * @description Creates token and cookie after user has been authenticated
 *
 * @param {Object} request - the request object
 * @param {Object} response - the response object
 *
 * @returns {Object} - The response object
 */
const createCookieAndToken = async (
  userData,
  statusCode,
  request,
  response,
) => {
  const token = userData.generateAccessToken();
  const expiry = 1 * 24 * 60 * 60 * 1000; // 1 day

  const cookieOptions = {
    expires: new Date(Date.now() + expiry),
    httpOnly: true,
    secure: request.secure || request.headers['x-forwarded-proto'] === 'https',
  };

  await client.setex(userData.id, expiry / 1000, token);

  const data = {};
  data.user = userData;

  response.cookie('wallet1313', token, cookieOptions);

  response.status(parseInt(statusCode, 10)).json({
    status: 'success',
    token,
    data,
  });
};

module.exports = {
  /**
   * @function signup
   * @description handles user signup
   *
   * @param {Object} request - the request object
   * @param {Object} response - the response object
   *
   * @returns {Function} creates a cookie from the response
   */
  signup: async (request, response) => {
    let trx;
    try {
      const { name, password, email } = request.body;
      trx = await sequelize.transaction();

      const checkuser = await users.getExistinguser(email);

      if (checkuser) {
        throw new ApplicationError(409, 'Email exists, please try another');
      }

      const newUser = await users.create(
        {
          name,
          password,
          email,
        },
        {
          transaction: trx,
        },
      );

      await wallets.create(
        {
          user_id: newUser.id,
          balance: 500000,
        },
        {
          transaction: trx,
        },
      );

      await trx.commit();
      await createCookieAndToken(newUser, 201, request, response);
    } catch (err) {
      await trx.rollback();
      DEBUG(err);
      throw err;
    }
  },

  /**
   * @function login
   * @description handles user login
   *
   * @param {Object} request - the request object
   * @param {Object} response - the response object
   *
   * @returns {Function} creates a cookie from the response
   */
  login: async (request, response) => {
    const { email, password } = request.body;
    const loginUser = await users.findOne({
      where: { email },
    });

    if (!loginUser) {
      throw new ApplicationError(401, 'email or password is incorrect');
    }

    const checkPassword = loginUser.validatePassword(password);
    if (!checkPassword) {
      throw new ApplicationError(401, 'email or password is incorrect');
    }

    await createCookieAndToken(loginUser, 200, request, response);
  },

  logout: async (request, response) => {
    response.cookie('wallet1313', 'invalid', {
      // Expire in 1 second
      expires: new Date(Date.now() + 1 * 1000),
      httpOnly: true,
    });
    await client.del(request.user.id);

    response.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  },
};
