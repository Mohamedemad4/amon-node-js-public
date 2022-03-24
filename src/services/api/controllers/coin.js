const errors = require('../../../helpers/errors');
const Models = require('../../../models/pg');

const CoinController = {
  async getCoinByCode(coinCode) {
    const coin = await Models.Coin.findByCoinCode(coinCode);

    errors.assertExposable(coin, 'unknown_coin_code');

    return coin.filterKeys();
  },

  async createCoin(name, coinCode) {
    let coin = await Models.Coin.findByCoinCode(coinCode);
    errors.assertExposable(!coin, 'coin_already_exists');

    coin = await Models.Coin.createCoin(name, coinCode);
    return coin.filterKeys();
  },
};

module.exports = CoinController;
