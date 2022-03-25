
const sinon = require('sinon');
const path = require('path');
const { getCoinGeckoIDfromCoinCode, fetchCoinPrice } = require(path.join(srcDir, '/helpers/coingecko-api.js'));
const { mockCoingecko, unmockCoingecko } = require('../../mocks/coingecko-nock')

describe('CoinGecko API helper', () => {
  let sandbox = null;

  beforeEach(function () {
    mockCoingecko()
    sandbox = sinon.createSandbox();
  });

  after(function () {
    sandbox && sandbox.restore();
    unmockCoingecko()
  });

  describe('getCoinGeckoIDfromCoinCode', () => {
    it('should get the id', async () => {
      const coingeckoID = await getCoinGeckoIDfromCoinCode('BTC')
      expect(coingeckoID).to.eq('bitcoin')

    });

    it('should return false on a bad coinCode', async () => {
      const coingeckoID = await getCoinGeckoIDfromCoinCode('fake coin')
      expect(coingeckoID).to.eq(false)
    });
  });

  describe('fetchCoinPrice', () => {
    it('should fetch coin price', async () => {
      const price = await fetchCoinPrice('bitcoin')
      expect(price).to.greaterThan(1)
    });
  });
});
