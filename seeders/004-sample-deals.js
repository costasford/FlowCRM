'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, get the contact and company IDs from the database
    const [contacts, companies] = await Promise.all([
      queryInterface.sequelize.query(
        `SELECT id, name FROM "Contacts" WHERE email IN (
          'sarah.johnson@sunsetapts.com',
          'mchen@downtowntower.com', 
          'lisa.r@maplewood-condos.com',
          'dthompson@riversideshops.com',
          'afoster@greenfield-industrial.com',
          'rkim@newprospect.com'
        );`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ),
      queryInterface.sequelize.query(
        `SELECT id, name FROM "Companies" WHERE name IN (
          'Sunset Apartments Complex',
          'Downtown Office Tower', 
          'Maplewood Condominiums',
          'Riverside Shopping Center',
          'Greenfield Industrial Park'
        );`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
    ]);

    const contactMap = contacts.reduce((acc, contact) => {
      acc[contact.name] = contact.id;
      return acc;
    }, {});

    const companyMap = companies.reduce((acc, company) => {
      acc[company.name] = company.id;
      return acc;
    }, {});

    const deals = [
      {
        id: uuidv4(),
        title: 'Sunset Apartments - Comprehensive Maintenance Contract',
        description: 'Annual maintenance contract covering HVAC, plumbing, electrical, and landscaping for 150-unit apartment complex.',
        stage: 'proposal',
        status: 'open',
        value: 180000.00,
        probability: 75,
        priority: 'high',
        closeDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        contactId: contactMap['Sarah Johnson'],
        companyId: companyMap['Sunset Apartments Complex'],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        title: 'Downtown Office Tower - Premium Cleaning Services',
        description: 'Daily cleaning services for high-end office building including common areas, offices, and executive floors.',
        stage: 'negotiation',
        status: 'open',
        value: 95000.00,
        probability: 80,
        priority: 'high',
        closeDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        contactId: contactMap['Michael Chen'],
        companyId: companyMap['Downtown Office Tower'],
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        title: 'Maplewood Condos - Individual Unit Maintenance Program',
        description: 'On-demand maintenance services for individual condo units with 24-hour emergency response.',
        stage: 'qualified',
        status: 'open',
        value: 45000.00,
        probability: 60,
        priority: 'medium',
        closeDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
        contactId: contactMap['Lisa Rodriguez'],
        companyId: companyMap['Maplewood Condominiums'],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        title: 'Riverside Shopping Center - Retail Space Lease',
        description: 'New 2,500 sq ft retail space lease for expanding restaurant chain.',
        stage: 'lead',
        status: 'open',
        value: 72000.00,
        probability: 25,
        priority: 'medium',
        closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
        contactId: contactMap['David Thompson'],
        companyId: companyMap['Riverside Shopping Center'],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        title: 'Industrial Park - Warehouse Security Upgrade',
        description: 'Complete security system upgrade including cameras, access control, and monitoring services.',
        stage: 'closed_won',
        status: 'won',
        value: 125000.00,
        probability: 100,
        priority: 'high',
        closeDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (closed)
        actualCloseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        contactId: contactMap['Amanda Foster'],
        companyId: companyMap['Greenfield Industrial Park'],
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        title: 'New Development - Property Management Partnership',
        description: 'Full property management services for new 200-unit apartment development.',
        stage: 'lead',
        status: 'open',
        value: 240000.00,
        probability: 35,
        priority: 'urgent',
        closeDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        contactId: contactMap['Robert Kim'],
        companyId: null, // No company associated yet
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        title: 'Sunset Apartments - Gym Equipment Lease',
        description: 'New fitness center equipment lease and maintenance for apartment complex amenities.',
        stage: 'qualified',
        status: 'open',
        value: 28000.00,
        probability: 70,
        priority: 'low',
        closeDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
        contactId: contactMap['Sarah Johnson'],
        companyId: companyMap['Sunset Apartments Complex'],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        title: 'Downtown Tower - Executive Floor Renovation',
        description: 'High-end renovation of executive floors including new flooring, lighting, and furniture.',
        stage: 'closed_lost',
        status: 'lost',
        value: 85000.00,
        probability: 0,
        priority: 'medium',
        closeDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago (closed)
        actualCloseDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        lostReason: 'Budget constraints - client chose lower-cost alternative',
        contactId: contactMap['Michael Chen'],
        companyId: companyMap['Downtown Office Tower'],
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        title: 'Shopping Center - Parking Lot Resurfacing',
        description: 'Complete parking lot resurfacing and re-striping for better customer experience.',
        stage: 'proposal',
        status: 'open',
        value: 35000.00,
        probability: 65,
        priority: 'medium',
        closeDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
        contactId: contactMap['David Thompson'],
        companyId: companyMap['Riverside Shopping Center'],
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        title: 'Maplewood - Pool and Spa Maintenance Contract',
        description: 'Weekly pool and spa maintenance services for condominium complex amenities.',
        stage: 'negotiation',
        status: 'open',
        value: 15600.00,
        probability: 85,
        priority: 'low',
        closeDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
        contactId: contactMap['Lisa Rodriguez'],
        companyId: companyMap['Maplewood Condominiums'],
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];

    await queryInterface.bulkInsert('Deals', deals, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Deals', {
      title: {
        [Sequelize.Op.in]: [
          'Sunset Apartments - Comprehensive Maintenance Contract',
          'Downtown Office Tower - Premium Cleaning Services',
          'Maplewood Condos - Individual Unit Maintenance Program',
          'Riverside Shopping Center - Retail Space Lease',
          'Industrial Park - Warehouse Security Upgrade',
          'New Development - Property Management Partnership',
          'Sunset Apartments - Gym Equipment Lease',
          'Downtown Tower - Executive Floor Renovation',
          'Shopping Center - Parking Lot Resurfacing',
          'Maplewood - Pool and Spa Maintenance Contract'
        ]
      }
    }, {});
  }
};