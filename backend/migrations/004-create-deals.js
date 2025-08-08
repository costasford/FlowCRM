'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('deals', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      stage: {
        type: Sequelize.ENUM('lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'),
        allowNull: false,
        defaultValue: 'lead'
      },
      status: {
        type: Sequelize.ENUM('open', 'won', 'lost', 'on_hold'),
        allowNull: false,
        defaultValue: 'open'
      },
      value: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      probability: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 50,
        validate: {
          min: 0,
          max: 100
        }
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'urgent'),
        allowNull: false,
        defaultValue: 'medium'
      },
      closeDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      actualCloseDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      lostReason: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      contactId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'contacts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      companyId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Companies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.addIndex('deals', ['stage']);
    await queryInterface.addIndex('deals', ['status']);
    await queryInterface.addIndex('deals', ['priority']);
    await queryInterface.addIndex('deals', ['contactId']);
    await queryInterface.addIndex('deals', ['companyId']);
    await queryInterface.addIndex('deals', ['closeDate']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('deals');
  }
};