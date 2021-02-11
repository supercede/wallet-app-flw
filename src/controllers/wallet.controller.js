const Ravepay = require('flutterwave-node');
const { config } = require('dotenv');
const { v4 } = require('uuid');
const models = require('../models');
const {
  BadRequestError,
  NotFoundError,
  ApplicationError,
} = require('../utils/errors');

config();

const PUBLIC_KEY = process.env.RAVEPAY_PUBLIC_KEY;
const SECRET_KEY = process.env.RAVEPAY_SECRET_KEY;
const BASE_URL = process.env.BASE_URL;

const rave = new Ravepay(PUBLIC_KEY, SECRET_KEY, false);
const { wallets, card_transactions, users, sequelize } = models;

module.exports = {
  fundWallet: async (request, response) => {
    const { cardno, cvv, expirymonth, expiryyear, amount, pin } = request.body;

    const payload = {
      cardno,
      cvv,
      expirymonth: expirymonth.toString(),
      expiryyear: expiryyear.toString(),
      currency: 'NGN',
      amount,
      email: request.user.email,
      phonenumber: '08162626272', // Mock phone number
      firstname: request.user.name,
      lastname: request.user.name,
      redirect_url: `${BASE_URL}/payment/verify`,
      txRef: v4(), // your unique merchant reference
    };

    const wallet = await request.user.getWallet();
    const resp = await rave.Card.charge(payload);

    const cardTxn = {
      reference: payload.txRef,
      amount,
      wallet_id: wallet.id,
    };

    if (resp.body.status === 'error') {
      cardTxn.status = 'fail';
      cardTxn.failure_reason = resp.body.message;

      await card_transactions.create(cardTxn);
      throw new BadRequestError(resp.body.message);
    }

    if (resp.body.data.suggested_auth) {
      const payload2 = payload;
      payload2.pin = pin;
      payload2.suggested_auth = resp.body.data.suggested_auth;

      const reCallCharge = await rave.Card.charge(payload2);

      if (reCallCharge.body.status === 'error') {
        cardTxn.status = 'fail';
        cardTxn.failure_reason = reCallCharge.body.message;

        await card_transactions.create(cardTxn);
        throw new BadRequestError(reCallCharge.body.message);
      }

      cardTxn.status = 'pending';
      cardTxn.external_reference = reCallCharge.body.data.flwRef;

      await card_transactions.create(cardTxn);
      return response.status(200).send({
        result: {
          message: 'success',
          data: reCallCharge.body.data,
        },
      });
    }

    cardTxn.status = 'pending';
    cardTxn.external_reference = resp.body.data.flwRef;
    await card_transactions.create(cardTxn);

    return response.status(200).send({
      result: {
        message: 'success',
        data: resp.body,
      },
    });
  },

  async validatePayment(request, response) {
    const trx = await sequelize.transaction();

    const { flwRef, otp } = request.body;
    const cardTxn = await card_transactions.findOne({
      where: {
        external_reference: flwRef,
      },
    });

    if (!cardTxn) {
      throw new NotFoundError('Payment transaction not found');
    }

    try {
      const resp = await rave.Card.validate({
        transaction_reference: flwRef,
        otp,
      });

      // console.log(resp.body)
      const { data } = resp.body;

      if (resp.body.status === 'error') {
        throw new BadRequestError(resp.body.message);
      }

      if (data.tx.status === 'failed') {
        cardTxn.status = 'failed';
        cardTxn.failure_reason = data.data.responsemessage;
        await cardTxn.save(trx);
        if (
          data.data.responsemessage.toLowerCase().includes('insufficient funds')
        ) {
          // Ex: 'Insufficient Funds: Your card cannot be charged due to insufficient funds. Please try another card or fund your card and try again.'
          throw new BadRequestError(data.data.responsemessage);
        }
        throw new BadRequestError('Payment failed, please try again');
      } else if (data.tx.status === 'successful') {
        // Check amt and currency
        cardTxn.status = 'success';
        await cardTxn.save(trx);

        await wallets.increment(
          { balance: cardTxn.amount },
          { where: { id: cardTxn.walletId }, transaction: trx },
        );

        await trx.commit();

        return response.status(200).json({
          message: 'payment successful',
          result: {
            data: data.tx,
          },
        });
      }
    } catch (error) {
      console.log(error);
      throw new ApplicationError(500);
    }
  },

  getWallet: async (request, response) => {
    const { id } = request.user;

    const wallet = await wallets.findOne({
      include: [
        {
          model: users,
          attributes: ['name', 'email'],
        },
      ],
      where: { user_id: id },
    });

    return response.status(200).json({
      status: 'success',
      data: {
        wallet,
      },
    });
  },
};
