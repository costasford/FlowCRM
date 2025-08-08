'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, get the company IDs from the database
    const companies = await queryInterface.sequelize.query(
      `SELECT id, name FROM "Companies" WHERE name IN (
        'Sunset Apartments Complex',
        'Downtown Office Tower', 
        'Maplewood Condominiums',
        'Riverside Shopping Center',
        'Greenfield Industrial Park'
      );`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const companyMap = companies.reduce((acc, company) => {
      acc[company.name] = company.id;
      return acc;
    }, {});

    const contacts = [
      {
        id: uuidv4(),
        name: 'Sarah Johnson',
        email: 'sarah.johnson@sunsetapts.com',
        phone: '(555) 123-4001',
        position: 'Property Manager',
        source: 'referral',
        tags: ['residential', 'high_value', 'maintenance_contract'],
        notes: 'Very interested in comprehensive maintenance services. Decision maker for the complex.',
        lastContacted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        isActive: true,
        companyId: companyMap['Sunset Apartments Complex'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Michael Chen',
        email: 'mchen@downtowntower.com',
        phone: '(555) 987-6001',
        position: 'Building Operations Director',
        source: 'website',
        tags: ['commercial', 'premium', 'long_term'],
        notes: 'Looking for premium maintenance services for high-end office building.',
        lastContacted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        isActive: true,
        companyId: companyMap['Downtown Office Tower'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Lisa Rodriguez',
        email: 'lisa.r@maplewood-condos.com',
        phone: '(555) 456-7001',
        position: 'HOA Board President',
        source: 'social_media',
        tags: ['residential', 'condo', 'individual_units'],
        notes: 'Represents homeowners association. Needs individual unit maintenance coordination.',
        lastContacted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        isActive: true,
        companyId: companyMap['Maplewood Condominiums'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'David Thompson',
        email: 'dthompson@riversideshops.com',
        phone: '(555) 234-5001',
        position: 'Facilities Manager',
        source: 'cold_outreach',
        tags: ['retail', 'mixed_use', 'high_traffic'],
        notes: 'Manages retail and office spaces. Concerned about minimizing business disruption.',
        isActive: true,
        companyId: companyMap['Riverside Shopping Center'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Amanda Foster',
        email: 'afoster@greenfield-industrial.com',
        phone: '(555) 345-6001',
        position: 'Operations Manager',
        source: 'event',
        tags: ['industrial', 'warehouse', 'manufacturing'],
        notes: 'Industrial complex with specialized maintenance needs. 24/7 operations.',
        lastContacted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        isActive: true,
        companyId: companyMap['Greenfield Industrial Park'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Robert Kim',
        email: 'rkim@newprospect.com',
        phone: '(555) 111-2222',
        position: 'Property Developer',
        source: 'referral',
        tags: ['new_development', 'multi_unit', 'potential_contract'],
        notes: 'Developing new apartment complex. Looking for property management partnership.',
        isActive: true,
        companyId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Contacts', contacts, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Contacts', {
      email: {
        [Sequelize.Op.in]: [
          'sarah.johnson@sunsetapts.com',
          'mchen@downtowntower.com',
          'lisa.r@maplewood-condos.com',
          'dthompson@riversideshops.com',
          'afoster@greenfield-industrial.com',
          'rkim@newprospect.com'
        ]
      }
    }, {});
  }
};