'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Coins', 'price', {
      type: Sequelize.DECIMAL
    })

    await queryInterface.addColumn('Coins', 'priceLastUpdated', {
      type: Sequelize.DATE
    })

    await queryInterface.addColumn('Coins', 'coinGeckoID', {
      type: Sequelize.STRING
    })

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Coins', 'price')
    await queryInterface.removeColumn('Coins', 'priceLastUpdated')
    await queryInterface.removeColumn('Coins', 'coinGeckoID')
  }
};