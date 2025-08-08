'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Activities', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      type: {
        type: Sequelize.ENUM('call', 'email', 'meeting', 'note', 'task_completed', 'deal_update', 'other'),
        allowNull: false
      },
      summary: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      outcome: {
        type: Sequelize.ENUM('positive', 'neutral', 'negative', 'no_response'),
        allowNull: true
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Duration in minutes'
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      contactId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Contacts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      dealId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Deals',
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
    await queryInterface.addIndex('Activities', ['type']);
    await queryInterface.addIndex('Activities', ['outcome']);
    await queryInterface.addIndex('Activities', ['timestamp']);
    await queryInterface.addIndex('Activities', ['contactId']);
    await queryInterface.addIndex('Activities', ['dealId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Activities');
  }
};