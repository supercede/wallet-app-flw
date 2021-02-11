const { v4 } = require('uuid');
const models = require('../models');

const { wallets, transactions } = models;

async function creditAccount({
  amount,
  walletId,
  purpose,
  reference = v4(),
  metadata,
  trx,
}) {
  const wallet = await wallets.findOne({ where: { id: walletId } });

  if (!wallet) {
    return {
      success: false,
      error: 'Account does not exist',
    };
  }

  await wallets.increment(
    { balance: amount },
    { where: { id: walletId }, transaction: trx },
  );

  await transactions.create(
    {
      txn_type: 'credit',
      purpose,
      amount,
      wallet_id: walletId,
      reference,
      metadata,
      balance_before: Number(wallet.balance),
      balance_after: Number(wallet.balance) + Number(amount),
      created_at: Date.now(),
      updated_at: Date.now(),
    },
    {
      transaction: trx,
      lock: trx.LOCK.UPDATE,
    },
  );
  return {
    success: true,
    message: 'Credit successful',
  };
}

async function debitAccount({
  amount,
  walletId,
  purpose,
  reference = v4(),
  metadata,
  trx,
}) {
  const wallet = await wallets.findOne({ where: { id: walletId } });

  if (!wallet) {
    return {
      success: false,
      error: 'Account does not exist',
    };
  }

  if (Number(wallet.balance) < amount) {
    return {
      success: false,
      error: 'Insufficient balance',
    };
  }
  await wallets.increment(
    { balance: -amount },
    { where: { id: walletId }, transaction: trx },
  );
  await transactions.create(
    {
      txn_type: 'debit',
      purpose,
      amount,
      wallet_id: walletId,
      reference,
      metadata,
      balance_before: Number(wallet.balance),
      balance_after: Number(wallet.balance) - Number(amount),
      created_at: Date.now(),
      updated_at: Date.now(),
    },
    {
      transaction: trx,
      lock: trx.LOCK.UPDATE,
    },
  );
  return {
    success: true,
    message: 'Debit successful',
  };
}

module.exports = { creditAccount, debitAccount };
