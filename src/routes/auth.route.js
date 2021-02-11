const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const catchAsync = require('../utils/catchAsync');
const authentication = require('../middleware/authentication');
const authValidation = require('../validation/auth.validation');
const validator = require('../middleware/validator');

const { authenticate } = authentication;
const { userLogInSchema, userSignUpSchema } = authValidation;

const { signup, login, logout } = authController;

const authRouter = Router();

authRouter.post('/signup', validator(userSignUpSchema), catchAsync(signup));
authRouter.post('/login', validator(userLogInSchema), catchAsync(login));
authRouter.post('/logout', authenticate, catchAsync(logout));

module.exports = authRouter;
