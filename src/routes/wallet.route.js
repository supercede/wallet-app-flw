const { Router } = require('express');
const walletController = require('../controllers/wallet.controller');
const authentication = require('../middleware/authentication');
const walletValidation = require('../validation/wallet.validation');
const validator = require('../middleware/validator');
const catchAsync = require('../utils/catchAsync');

const { authenticate } = authentication;
const { fundWalletSchema } = walletValidation;
const { getWallet, fundWallet, validatePayment } = walletController;

const walletRouter = Router();

walletRouter.post(
  '/fund-wallet',
  authenticate,
  validator(fundWalletSchema),
  catchAsync(fundWallet),
);
walletRouter.post('/funding/validate', catchAsync(validatePayment));

walletRouter.get('/', authenticate, getWallet);

module.exports = walletRouter;
