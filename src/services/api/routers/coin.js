const Joi = require('joi');
const Router = require('@koa/router');
const CoinController = require('../controllers/coin');
const { validateParams } = require('../../../helpers/validation');

const CoinRouter = {
  schemaGetByCoinCode: Joi.object({
    coinCode: Joi.string().min(3).uppercase().max(5),
  }),

  schemaPutCoinCode: Joi.object({
    coinCode: Joi.string().min(3).uppercase().max(5),
    name: Joi.string()
  }),

  async getCoinByCode(ctx) {
    const params = {
      coinCode: ctx.params.coinCode,
    };

    const formattedParams = await validateParams(CoinRouter.schemaGetByCoinCode, params);

    ctx.body = await CoinController.getCoinByCode(formattedParams.coinCode);
  },

  async putCoin(ctx) {
    const params = {
      coinCode: ctx.request.body.coinCode,
      name: ctx.request.body.name
    }
    const formattedParams = await validateParams(CoinRouter.putCoinByCode, params)
    ctx.body = await CoinController.createCoin(formattedParams);
  },

  router() {
    const router = Router();

    /**
     * @api {get} / Get coinCode
     * @apiName coinCode
     * @apiGroup Coin
     * @apiDescription Get coinCode
     *
     * @apiSampleRequest /
     *
     */
    router.get('/:coinCode', CoinRouter.getCoinByCode);

    /**
     * @api {put} /createCoin Create a coin
     * @apiName createCoin
     * @apiGroup Coin
     * @apiDescription create coin
     * 
     * 
     * @apiParam {String} coinCode The code of the coin
     * @apiParam {String} name The name of the coin
     * @apiSampleRequest /createCoin
     * 
     */
    router.put('/createCoin', CoinRouter.putCoin);
    return router;
  },
};

module.exports = CoinRouter;
