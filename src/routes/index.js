const { Router } = require('express');
const authRoutes = require('./auth.route');
const transactionsRoutes = require('./transactions.route');
const walletRoutes = require('./wallet.route');

const router = Router();

router.use('/auth', authRoutes);
router.use('/transactions', transactionsRoutes);
router.use('/wallet', walletRoutes);

module.exports = router;
