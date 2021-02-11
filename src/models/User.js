/* eslint-disable func-names */
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const { config } = require('dotenv');
const jwt = require('jsonwebtoken');

config();

const secret = process.env.JWT_SECRET;

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.wallets);
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      modelName: 'users',
      underscored: true,
    },
  );

  User.getExistinguser = async (queryString, column = 'email') => {
    const userData = await User.findOne({
      where: { [column]: queryString },
    });
    return userData;
  };

  User.beforeCreate(async user => {
    user.password = await user.generatePasswordHash();
  });

  User.beforeUpdate(async user => {
    if (user.changed('password')) {
      user.password = await user.generatePasswordHash();
      user.passwordLastChanged = Date.now();
    }
  });

  User.prototype.generatePasswordHash = async function () {
    const saltRounds = +process.env.SALT;
    return bcrypt.hash(this.password, saltRounds);
  };

  User.prototype.generateAccessToken = function () {
    return jwt.sign({ id: this.id }, secret, {
      expiresIn: '1d',
    });
  };

  User.prototype.toJSON = function () {
    const values = { ...this.get() };

    delete values.password;
    delete values.createdAt;
    delete values.updatedAt;
    return values;
  };

  User.prototype.validatePassword = function validatePassword(password) {
    return bcrypt.compareSync(password, this.password);
  };

  return User;
};
