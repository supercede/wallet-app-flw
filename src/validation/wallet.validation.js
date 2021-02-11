const { check } = require('express-validator');

module.exports = {
  fundWalletSchema: [
    check('amount')
      .not()
      .isEmpty()
      .withMessage('Transaction amount required')
      .isNumeric()
      .withMessage('Amount must be a number')
      .matches(/^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/)
      .withMessage('Amount should be limited to 2 decimal places')
      .custom(value => {
        if (value <= 49) {
          throw new Error('Transaction amount must be at least 50 naira');
        }
        return value;
      }),
    check('cardno').not().isEmpty().withMessage('card number is required'),
    check('expirymonth')
      .not()
      .isEmpty()
      .withMessage('card expiry month is required'),
    check('expiryyear')
      .not()
      .isEmpty()
      .withMessage('card expiry year is required'),
    check('cvv').not().isEmpty().withMessage('card cvv is required'),
    check('pin').not().isEmpty().withMessage('card pin is required'),
  ],
};
