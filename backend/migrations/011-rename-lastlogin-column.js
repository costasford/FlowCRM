'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('users', 'lastLogin', 'lastLoginAt');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('users', 'lastLoginAt', 'lastLogin');
  }
};
