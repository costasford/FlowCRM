'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('leadscores', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 100
        }
      },
      factors: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'JSON object containing scoring factors and their values'
      },
      lastCalculated: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      contactId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'contacts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes
    await queryInterface.addIndex('leadscores', ['score']);
    await queryInterface.addIndex('leadscores', ['contactId'], { unique: true });
    await queryInterface.addIndex('leadscores', ['lastCalculated']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('leadscores');
  }
};