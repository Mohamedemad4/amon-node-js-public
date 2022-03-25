const errors = require('../../../helpers/errors');
const Models = require('../../../models/pg');
const { fetchCoinPrice, getCoinGeckoIDfromCoinCode } = require('../../../helpers/coingecko-api');

const CoinController = {
  async getCoinByCode(coinCode) {
    let coin = await Models.Coin.findByCoinCode(coinCode);

    errors.assertExposable(coin, 'unknown_coin_code');

    // if the last update was an hour ago check coingecko for an update
    if (coin.priceLastUpdated < new Date() - 1000 * 60 * 60 || !coin.priceLastUpdated) {
      const price = await fetchCoinPrice(coin.coinGeckoID);
      if (price) coin = await Models.Coin.updateCoinPrice(coinCode, price);
    }
    return coin.filterKeys();
  },

  async createCoin(name, coinCode) {
    let coin = await Models.Coin.findByCoinCode(coinCode);
    errors.assertExposable(!coin, 'coin_already_exists');

    const coinGeckoID = await getCoinGeckoIDfromCoinCode(coinCode);
    errors.assertExposable(coinGeckoID, 'invalid_coin_code'); // throw an error if coinGecko doesn't know the coin

    coin = await Models.Coin.createCoin(name, coinCode, coinGeckoID);
    return coin.filterKeys();
  },
};

module.exports = CoinController;
