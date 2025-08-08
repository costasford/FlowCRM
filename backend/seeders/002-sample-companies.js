'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const companies = [
      {
        id: uuidv4(),
        name: 'Sunset Apartments Complex',
        industry: 'Residential Property Management',
        size: '51-200',
        location: 'Los Angeles, CA',
        phone: '(555) 123-4567',
        website: 'https://sunsetapts.com',
        revenue: 2500000.00,
        notes: 'Large apartment complex with 150 units. Potential for maintenance contract.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Downtown Office Tower',
        industry: 'Commercial Property Management',
        size: '201-500',
        location: 'San Francisco, CA',
        phone: '(555) 987-6543',
        website: 'https://downtowntower.com',
        revenue: 5000000.00,
        notes: 'Premium office building with high-end tenants. Excellent maintenance standards required.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Maplewood Condominiums',
        industry: 'Residential Property Management',
        size: '11-50',
        location: 'Portland, OR',
        phone: '(555) 456-7890',
        revenue: 1200000.00,
        notes: 'Luxury condos with homeowners association. Individual unit management.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Riverside Shopping Center',
        industry: 'Retail Property Management',
        size: '51-200',
        location: 'Sacramento, CA',
        phone: '(555) 234-5678',
        website: 'https://riversideshops.com',
        revenue: 3200000.00,
        notes: 'Mixed-use development with retail and office spaces. High foot traffic area.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Greenfield Industrial Park',
        industry: 'Industrial Property Management',
        size: '101-500',
        location: 'Oakland, CA',
        phone: '(555) 345-6789',
        revenue: 4500000.00,
        notes: 'Large industrial complex with warehouse and manufacturing spaces.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Companies', companies, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Companies', {
      name: {
        [Sequelize.Op.in]: [
          'Sunset Apartments Complex',
          'Downtown Office Tower', 
          'Maplewood Condominiums',
          'Riverside Shopping Center',
          'Greenfield Industrial Park'
        ]
      }
    }, {});
  }
};