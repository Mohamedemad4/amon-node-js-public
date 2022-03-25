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
        type: DataTypes.DECIMAL,
      },
      priceLastUpdated: {
        type: DataTypes.DATE,
      },
      // coinGecko keeps a seperate ID that's independant from both the coin symbol or "coinCode" and the coin's name
      // since it's an authoritative source for coin data it makes sense to also keep record of what IDs it uses for each coin since it makes querying their APIs easier
      coinGeckoID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  Coin.prototype.filterKeys = function () {
    const obj = this.toObject();
    const filtered = pick(obj, 'id', 'name', 'code', 'price', 'priceLastUpdated');

    return filtered;
  };

  Coin.findByCoinCode = function (code, tOpts = {}) {
    return Coin.findOne(Object.assign({ where: { code } }, tOpts));
  };

  Coin.updateCoinPrice = async function (code, price, tOpts = {}) {
    const coin = await Coin.findByCoinCode(code, tOpts);
    coin.price = price;
    coin.priceLastUpdated = new Date();
    coin.save();
    return coin;
  };

  Coin.createCoin = function (name, code, coinGeckoID, tOpts = {}) {
    return Coin.create(
      {
        name: name,
        code: code,
        coinGeckoID: coinGeckoID,
      },
      tOpts
    );
  };

  return Coin;
};
