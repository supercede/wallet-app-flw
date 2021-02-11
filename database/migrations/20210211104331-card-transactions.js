module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('card_transactions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      wallet_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'wallets',
          key: 'id',
        },
      },
      external_reference: {
        // allowNull: false,
        type: Sequelize.STRING,
      },
      amount: {
        allowNull: false,
        type: Sequelize.DECIMAL(20, 4),
      },
      reference: {
        type: Sequelize.UUID,
        unique: true,
      },
      failure_reason: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM('success', 'fail', 'pending'),
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  down: async (queryInterface, _Sequelize) => {
    queryInterface.dropTable('card_transactions');
  },
};
