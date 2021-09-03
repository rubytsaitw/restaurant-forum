'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      id: 5,
      name: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: true,
      avatar: `https://loremflickr.com/320/240/paris,girl/?lock=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 15,
      name: 'user1',
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      avatar: `https://loremflickr.com/320/240/paris,girl/?lock=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 25,
      name: 'user2',
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      avatar: `https://loremflickr.com/320/240/paris,girl/?lock=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}