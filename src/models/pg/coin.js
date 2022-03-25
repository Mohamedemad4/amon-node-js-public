const { v4: uuid } = require('uuid');
const { pick } = require('lodash');

module.exports = function (sequelize, DataTypes) {
  const Coin = sequelize.define(
    'Coin',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid(),
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      price: {
        type: DataTypes.DECIMAL
      },
      priceLastUpdated: {
        type: DataTypes.DATE
      }
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  Coin.prototype.filterKeys = function () {
    const obj = this.toObject();
    const filtered = pick(obj, 'id', 'name', 'code', 'price');

    return filtered;
  };

  Coin.findByCoinCode = function (code, tOpts = {}) {
    return Coin.findOne(Object.assign({ where: { code } }, tOpts));
  };

  Coin.updateCoinPrice = async function (code, price, tOpts = {}) {
    const coin = await Coin.findByCoinCode(code, tOpts)
    coin.price = price
    coin.priceLastUpdated = new Date()
    coin.save()
    return coin
  }

  Coin.createCoin = function (name, code, tOpts = {}) {
    return Coin.create(
      {
        name: name,
        code: code,
      },
      tOpts
    );
  };

  return Coin;
};
