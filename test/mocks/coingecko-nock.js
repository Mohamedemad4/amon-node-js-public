const nock = require('nock');

module.exports.mockCoingecko = () => {
  return nock('https://api.coingecko.com')
    .get('/api/v3/coins/list')
    .reply(200, [
      {
        symbol: 'btc',
        name: 'Bitcoin',
        id: 'bitcoin',
      },
      {
        symbol: 'bch',
        name: 'Bitcoin Cash',
        id: 'bitcoin-cash',
      },
      {
        symbol: 'etc',
        name: 'ethereum classic',
        id: 'ethereum-classic',
      },
    ])
    .get('/api/v3/simple/price')
    .query({
      ids: 'bitcoin',
      vs_currencies: 'USD',
    })
    .reply(200, {
      bitcoin: {
        usd: 2000,
      },
    });
};

module.exports.unmockCoingecko = () => {
  return nock.restore();
};
