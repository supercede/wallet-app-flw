const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CardTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CardTransaction.belongsTo(models.wallets);
    }
  }
  CardTransaction.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      external_reference: {
        type: DataTypes.STRING,
        // unique: true,
      },
      reference: {
        type: DataTypes.UUID,
        unique: true,
      },

      wallet_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(20, 4).UNSIGNED,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('success', 'fail', 'pending'),
      },
      failure_reason: {
        type: DataTypes.STRING,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'card_transactions',
      underscored: true,
    },
  );

  CardTransaction.prototype.toJSON = function () {
    const values = { ...this.get() };

    delete values.createdAt;
    delete values.updatedAt;
    return values;
  };

  return CardTransaction;
};
