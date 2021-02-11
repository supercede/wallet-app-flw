module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      txn_type: {
        allowNull: false,
        type: Sequelize.ENUM('debit', 'credit'),
      },
      purpose: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        allowNull: false,
        type: Sequelize.DECIMAL(20, 4),
      },
      wallet_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'wallets',
          key: 'id',
        },
      },
      reference: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      balance_before: {
        allowNull: false,
        type: Sequelize.DECIMAL(20, 4),
      },
      balance_after: {
        allowNull: false,
        type: Sequelize.DECIMAL(20, 4),
      },
      metadata: {
        allowNull: true,
        type: Sequelize.JSON,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('transactions');
  },
};
