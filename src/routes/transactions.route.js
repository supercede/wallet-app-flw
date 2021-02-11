const { Router } = require('express');
const transactionController = require('../controllers/transaction.controller');
const authentication = require('../middleware/authentication');
const transactionValidation = require('../validation/transaction.validation');
const validator = require('../middleware/validator');
const catchAsync = require('../utils/catchAsync');

const { authenticate } = authentication;
const {
  transferFundsSchema,
  transactionSortSchema,
  transactionTypeSchema,
} = transactionValidation;
const {
  transferFunds,
  getOneTransaction,
  getUserTransactions,
} = transactionController;
const transactionsRouter = Router();

transactionsRouter.post(
  '/transfer',
  authenticate,
  validator(transferFundsSchema),
  catchAsync(transferFunds),
);

transactionsRouter.get(
  '/history',
  authenticate,
  validator(transactionSortSchema),
  validator(transactionTypeSchema),
  catchAsync(getUserTransactions),
);
transactionsRouter.get('/:id', authenticate, catchAsync(getOneTransaction));

module.exports = transactionsRouter;
