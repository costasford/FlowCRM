'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminId = uuidv4();
    
    await queryInterface.bulkInsert('Users', [{
      id: adminId,
      name: 'FlowCRM Admin',
      email: 'admin@flowcrm.com',
      passwordHash: hashedPassword,
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // Create sample manager user
    const managerPassword = await bcrypt.hash('manager123', 12);
    const managerId = uuidv4();

    await queryInterface.bulkInsert('Users', [{
      id: managerId,
      name: 'Property Manager',
      email: 'manager@flowcrm.com',
      passwordHash: managerPassword,
      role: 'manager',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // Create sample regular user
    const userPassword = await bcrypt.hash('user123', 12);
    const userId = uuidv4();

    await queryInterface.bulkInsert('Users', [{
      id: userId,
      name: 'Leasing Agent',
      email: 'agent@flowcrm.com',
      passwordHash: userPassword,
      role: 'user',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    console.log('Sample users created:');
    console.log('Admin: admin@flowcrm.com / admin123');
    console.log('Manager: manager@flowcrm.com / manager123');
    console.log('User: agent@flowcrm.com / user123');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {
      email: {
        [Sequelize.Op.in]: ['admin@flowcrm.com', 'manager@flowcrm.com', 'agent@flowcrm.com']
      }
    }, {});
  }
};