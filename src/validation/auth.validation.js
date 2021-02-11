const { check } = require('express-validator');

module.exports = {
  userSignUpSchema: [
    check('name')
      .trim()
      .not()
      .isEmpty()
      .withMessage('name is required')
      .isLength({ min: 2, max: 30 })
      .withMessage('name should be between 2 to 30 characters')
      .matches(/^[a-zA-ZÀ-ÖØ-öø-ÿ '.-]*$/)
      .withMessage('Enter a valid name'),

    check('email')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Email address is required')
      .isEmail()
      .withMessage('Enter a valid email address'),

    check('password')
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Password is required')
      .isLength({ min: 8, max: 40 })
      .withMessage('Password should be between 8 to 40 characters'),

    check('passwordConfirm')
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('PasswordConfirm field is required')
      .custom((value, { req, loc, path }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        } else {
          return value;
        }
      }),
  ],

  userLogInSchema: [
    check('email')
      .trim()
      .not()
      .isEmpty()
      .withMessage('email is required'),

    check('password')
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('This field is required')
      .isLength({ min: 8, max: 40 })
      .withMessage('Password should be between 8 to 40 characters'),
  ],
};
