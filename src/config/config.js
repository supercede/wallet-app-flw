/* eslint-disable implicit-arrow-linebreak,no-confusing-arrow */

const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logQueryParameters: true,
    define: {
      timestamps: true,
      underscored: true,
    },
    logging: str =>
      process.env.SHOW_SQL_LOGS
        ? console.log(`[SEQUELIZE DATABASE] ${str}`)
        : null,
  },

  staging: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_TEST_DATABASE,
    host: process.env.DB_HOST,
    define: {
      timestamps: true,
      underscored: true,
    },
    dialect: 'mysql',
  },

  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_TEST_DATABASE,
    host: process.env.DB_HOST,
    logging: false,
    dialect: 'mysql',
  },

  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    define: {
      timestamps: true,
      underscored: true,
    },
    dialect: 'mysql',
  },
};
