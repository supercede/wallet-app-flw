const { check, query } = require('express-validator');

module.exports = {
  transactionSortSchema: [
    query('sort')
      .optional()
      .isIn(['date', '-date', 'amount', '-amount'])
      .withMessage('Accepted values for sorting: date, -date, amount, -amount'),
  ],

  transactionTypeSchema: [
    query('type')
      .optional()
      .isIn(['credit', 'debit'])
      .withMessage('Accepted values: debit, credit'),
  ],

  transactionStatusSchema: [
    query('status')
      .optional()
      .isIn(['success', 'failed', 'pending'])
      .withMessage("Accepted values: 'success', 'failed', 'pending'"),
  ],

  transferFundsSchema: [
    check('recipientId')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Recipient wallet id is required')
      .isUUID('4')
      .withMessage('walletId is not a valid UUID'),

    check('amount')
      .not()
      .isEmpty()
      .withMessage('Transaction amount required')
      .isNumeric()
      .withMessage('Amount must be a number')
      .matches(/^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/)
      .withMessage('Amount should be limited to 2 decimal places')
      .custom(value => {
        if (value <= 19) {
          throw new Error('Transaction amount must be at least 20 naira');
        }
        return value;
      }),

    check('narration').not().isEmpty().withMessage('Narration required'),
  ],
};
