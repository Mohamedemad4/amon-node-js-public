const superagent = require('superagent');
const logger = require('../modules/logger');

/**
 * does a bruteforce search all coins that geckoCoin has until it finds a coin with the corrosponsind symbol
 * @param {*} coinCode
 * @returns the coinGeckoID for the coinCode("symbol" or "ticker") || an empty string if coinGecko doesn't know the coinCode
 */
module.exports.getCoinGeckoIDfromCoinCode = async function (coinCode) {
  const coinGeckoList = await superagent.get('https://api.coingecko.com/api/v3/coins/list');
  coinGeckoListing = coinGeckoList.body.find((coin) => {
    if (coin.symbol === coinCode.toLowerCase()) return true
  })

  if (coinGeckoListing) {
    return coinGeckoListing.id
  }
  return false
};

/**
 * gets current coin price from coinGecko
 * @param {*} coinGeckoID
 * @returns coin price in USD
 */
module.exports.fetchCoinPrice = async function (coinGeckoID) {
  try {
    const coinPriceInUSD = await superagent.get('https://api.coingecko.com/api/v3/simple/price', {

      ids: coinGeckoID,
      vs_currencies: 'USD',

    });
    return coinPriceInUSD.body[coinGeckoID]['usd'];
  } catch (e) {
    logger.warn(e);
    return;
  }
};
