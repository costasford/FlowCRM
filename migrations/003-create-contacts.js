'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Contacts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      position: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      source: {
        type: Sequelize.ENUM('website', 'referral', 'social_media', 'cold_outreach', 'event', 'advertisement', 'other'),
        allowNull: true,
        defaultValue: 'other'
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: []
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      lastContacted: {
        type: Sequelize.DATE,
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    await queryInterface.addIndex('Contacts', ['name']);
    await queryInterface.addIndex('Contacts', ['email']);
    await queryInterface.addIndex('Contacts', ['source']);
    await queryInterface.addIndex('Contacts', ['isActive']);
    await queryInterface.addIndex('Contacts', ['companyId']);
    await queryInterface.addIndex('Contacts', ['lastContacted']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Contacts');
  }
};