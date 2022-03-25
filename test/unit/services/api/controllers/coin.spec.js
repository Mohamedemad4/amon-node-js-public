const path = require('path');
const sinon = require('sinon');
const sequelizeMockingMocha = require('sequelize-mocking').sequelizeMockingMocha;
const CoinController = require(path.join(srcDir, '/services/api/controllers/coin'));
const DB = require(path.join(srcDir, 'modules/db'));
const { mockCoingecko, unmockCoingecko } = require('../../../../mocks/coingecko-nock')

describe('Controller: Coin', () => {
  let sandbox = null;

  sequelizeMockingMocha(DB.sequelize, [path.resolve('test/mocks/coins.json')], { logging: false });

  beforeEach(async () => {
    mockCoingecko()
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    unmockCoingecko()
    sandbox && sandbox.restore();
  });

  describe('getCoinByCode', () => {
    it('should get coin by code', async () => {
      const coinCode = 'BTC';
      const coin = await CoinController.getCoinByCode(coinCode);

      expect(coin.code).to.eq(coinCode);
      expect(Object.keys(coin).length).to.eq(5);
    });

    it('should update coin price if an hour passes', async () => {
      const coinCode = 'BTC';
      await CoinController.getCoinByCode(coinCode); // fetch current price


      sinon.useFakeTimers(new Date(+new Date() + 60 * 1000 * 30).getTime()); // advance clock by 30m
      let coin2 = await CoinController.getCoinByCode(coinCode);
      // check if priceLastUpdated is approx 30m ago
      expect(coin2.priceLastUpdated.valueOf()).to.approximately(new Date(+new Date() - 60 * 1000 * 30).valueOf(), 1000);


      clock = sinon.useFakeTimers(new Date(+new Date() + 60 * 1000 * 31).getTime()); // advance clock by 31m
      let coin3 = await CoinController.getCoinByCode(coinCode);
      // check if the priceLastUpdated is now
      expect(coin3.priceLastUpdated.valueOf()).to.approximately(new Date().valueOf(), 1000);

      clock.restore();
    });
    it('should fail get coin by code', async () => {
      const coinCode = 'AMN';
      expect(CoinController.getCoinByCode(coinCode)).to.be.rejectedWith(Error, 'unknown_coin_code');
    });
  });

  describe('createCoin', () => {
    const coinCode = 'ETC';
    const coinName = 'Ether Classic';

    it('should create a new coin', async () => {
      const coin = await CoinController.createCoin(coinName, coinCode);
      expect(coin.code).to.eq(coinCode);
      expect(coin.name).to.eq(coinName);
    });

    it('should refuse creating the same coin if it exists', async () => {
      await CoinController.createCoin(coinName, coinCode);
      expect(CoinController.createCoin(coinName, coinCode)).to.be.rejectedWith(Error, 'coin_already_exists');
    });

    it('should refuse creating a coin with an invalid coinCode', () => {
      expect(CoinController.createCoin(coinName, 'fakecoin')).to.be.rejectedWith(Error, 'invalid_coin_code');
    });
  });
});
