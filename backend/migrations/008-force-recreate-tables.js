'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Force recreate users table if it doesn't exist
    const tables = await queryInterface.showAllTables();
    
    if (!tables.includes('users')) {
      await queryInterface.createTable('users', {
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
          allowNull: false,
          unique: true
        },
        passwordHash: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        role: {
          type: Sequelize.ENUM('admin', 'manager', 'user'),
          allowNull: false,
          defaultValue: 'user'
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        lastLoginAt: {
          type: Sequelize.DATE,
          allowNull: true
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
      await queryInterface.addIndex('users', ['email'], { unique: true });
      await queryInterface.addIndex('users', ['role']);
      await queryInterface.addIndex('users', ['isActive']);
    }

    // Force recreate other essential tables
    if (!tables.includes('companies')) {
      await queryInterface.createTable('companies', {
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
        industry: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        size: {
          type: Sequelize.ENUM('1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'),
          allowNull: true
        },
        website: {
          type: Sequelize.STRING(255),
          allowNull: true
        },
        location: {
          type: Sequelize.STRING(255),
          allowNull: true
        },
        phone: {
          type: Sequelize.STRING(50),
          allowNull: true
        },
        revenue: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: true
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
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
    }

    console.log('✅ Force migration completed - essential tables created if missing');
  },

  down: async (queryInterface, Sequelize) => {
    // Don't drop tables in down migration for safety
    console.log('⚠️ Down migration skipped for safety');
  }
};