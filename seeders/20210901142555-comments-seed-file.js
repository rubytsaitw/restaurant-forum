'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 20 }).map((d, i) =>
        ({
          text: faker.lorem.text().substring(0, 30),
          createdAt: new Date(),
          updatedAt: new Date(),
          UserId: Math.floor((Math.random() * 3) + 1) * 5,
          RestaurantId: Math.floor(Math.random() * 50) + 1
        })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
};
