'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tasks', {
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
      status: {
        type: Sequelize.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'urgent'),
        allowNull: false,
        defaultValue: 'medium'
      },
      dueDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      completedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      estimatedHours: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      actualHours: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      assignedUserId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.addIndex('Tasks', ['status']);
    await queryInterface.addIndex('Tasks', ['priority']);
    await queryInterface.addIndex('Tasks', ['assignedUserId']);
    await queryInterface.addIndex('Tasks', ['contactId']);
    await queryInterface.addIndex('Tasks', ['dealId']);
    await queryInterface.addIndex('Tasks', ['dueDate']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Tasks');
  }
};