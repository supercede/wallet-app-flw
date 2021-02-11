const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Wallet.belongsTo(models.users);
      Wallet.hasMany(models.transactions);
    }
  }
  Wallet.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      balance: {
        type: DataTypes.DECIMAL(20, 4).UNSIGNED,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'wallets',
      underscored: true,
    },
  );

  Wallet.prototype.toJSON = function () {
    const values = { ...this.get() };

    delete values.createdAt;
    delete values.updatedAt;
    return values;
  };

  return Wallet;
};
