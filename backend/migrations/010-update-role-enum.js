'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Update the role enum to include 'agent'
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_users_role" ADD VALUE 'agent';
    `);
  },

  async down(queryInterface, Sequelize) {
    // Note: PostgreSQL doesn't support removing enum values easily
    // This would require recreating the enum, which is complex
    // For now, we'll leave the enum as-is on rollback
    console.log('Warning: Cannot easily remove enum value from PostgreSQL. Manual intervention may be required.');
  }
};