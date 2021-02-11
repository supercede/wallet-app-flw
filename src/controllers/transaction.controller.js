const { v4 } = require('uuid');
const models = require('../models');
const {
  ApplicationError,
  NotFoundError,
  BadRequestError,
} = require('../utils/errors');
const transactionsService = require('../services/transaction.service');
// const transactionService = require('../')
const utils = require('../utils/utils');

const { creditAccount, debitAccount } = transactionsService;
const { paginate } = utils;
const { wallets, transactions } = models;

module.exports = {
  /**
   * @description Initiate a transfer
   *
   * @param {Object} req - The request Object
   * @param {Object} res - The response Object
   *
   * @returns {Object} res - The response Object
   */
  transferFunds: async (request, response) => {
    const { recipientId, amount, narration } = request.body;
    const userWallet = await request.user.getWallet();

    const senderId = userWallet.id;

    const trx = await models.sequelize.transaction();
    try {
      if (senderId === recipientId) {
        throw new BadRequestError('You cannot transfer to yourself');
      }

      const reference = v4();
      const purpose = 'transfer';

      const transferResult = await Promise.all([
        debitAccount({
          amount,
          walletId: senderId,
          purpose,
          reference,
          metadata: {
            recipientId,
            narration,
          },
          trx,
        }),
        creditAccount({
          amount,
          walletId: recipientId,
          purpose,
          reference,
          metadata: {
            senderId,
            narration,
          },
          trx,
        }),
      ]);

      const failedTxns = transferResult.filter(result => !result.success);
      if (failedTxns.length) {
        await trx.rollback();
        // return transferResult;
        return response.status(400).json({
          status: 'error',
          error: failedTxns[0].error,
        });
      }

      await trx.commit();
      return response.status(200).json({
        status: 'success',
        message: 'transfer successful',
      });
    } catch (error) {
      await trx.rollback();
      // return {
      //   success: false,
      //   error: 'internal server error',
      // };
      throw error;
    }
  },

  /**
   * @description Get a user's transactions
   *
   * @param {Object} req - The request Object
   * @param {Object} res - The response Object
   *
   * @returns {Object} res - The response Object
   */
  getUserTransactions: async (request, response) => {
    const { page = 1, limit = 10, sort, type } = request.query;
    const wallet = await request.user.getWallet();

    const query = { where: { walletId: wallet.id }, order: [] };

    const queryOptions = {
      type,
      sort,
      limit,
      page,
    };

    const allTransactions = await paginate(transactions, query, queryOptions);

    return response.status(200).json({
      status: 'success',
      data: {
        transactions: allTransactions.rows,
      },
      count: allTransactions.count,
      page: +page,
      limit: +limit,
    });
  },

  /**
   * @description Get a single transaction
   *
   * @param {Object} req - The request Object
   * @param {Object} res - The response Object
   *
   * @returns {Object} res - The response Object
   */
  getOneTransaction: async (req, res) => {
    const { id } = req.params;
    const wallet = await req.user.getWallet();
    const transaction = await transactions.findOne({
      where: {
        walletId: wallet.id,
        id,
      },
    });

    if (!transaction) throw new NotFoundError('Transaction not found');

    return res.status(200).json({
      status: 'success',
      data: {
        transaction,
      },
    });
  },
};
