const { sequelize, User, Company, Contact, Deal, Task, Activity, LeadScore } = require('../models');

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...');
    
    // Authenticate connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Create each model individually to handle errors gracefully
    const models = [User, Company, Contact, Deal, Task, Activity, LeadScore];
    
    for (const Model of models) {
      try {
        await Model.sync({ force: false, alter: false });
        console.log(`✅ ${Model.name} table ready`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️ ${Model.name} table already exists, skipping...`);
        } else {
          console.log(`❌ Error with ${Model.name} table:`, error.message);
          throw error;
        }
      }
    }
    
    // Check if admin user exists
    const adminExists = await User.findOne({ where: { email: 'admin@flowcrm.com' } });
    
    if (!adminExists) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await User.create({
        name: 'Admin User',
        email: 'admin@flowcrm.com',
        passwordHash: hashedPassword,
        role: 'admin'
      });
      
      console.log('✅ Admin user created (admin@flowcrm.com / admin123)');
    } else {
      console.log('✅ Admin user already exists');
    }
    
    // Create sample data
    const sampleCompanies = await Company.bulkCreate([
      {
        name: 'Sunset Properties',
        industry: 'Real Estate',
        location: 'San Francisco, CA',
        phone: '(555) 123-4567',
        notes: 'Luxury residential properties in downtown SF'
      },
      {
        name: 'Greenfield Developments',
        industry: 'Property Development',
        location: 'Austin, TX',
        phone: '(555) 987-6543',
        notes: 'Commercial and residential development projects'
      }
    ]);
    console.log('✅ Sample companies created');

    // Create sample contacts
    const sampleContacts = await Contact.bulkCreate([
      {
        name: 'John Smith',
        email: 'john.smith@sunset.com',
        phone: '(555) 111-2222',
        companyId: sampleCompanies[0].id,
        jobTitle: 'Property Manager',
        notes: 'Primary contact for Sunset Properties'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.j@greenfield.com',
        phone: '(555) 333-4444',
        companyId: sampleCompanies[1].id,
        jobTitle: 'Development Director',
        notes: 'Handles all new development projects'
      }
    ]);
    console.log('✅ Sample contacts created');

    // Create sample deals
    await Deal.bulkCreate([
      {
        title: 'Downtown Condo Lease',
        contactId: sampleContacts[0].id,
        companyId: sampleCompanies[0].id,
        value: 250000,
        stage: 'proposal',
        status: 'open',
        description: '2-bedroom luxury condo lease for 2 years'
      },
      {
        title: 'Commercial Development Contract',
        contactId: sampleContacts[1].id,
        companyId: sampleCompanies[1].id,
        value: 850000,
        stage: 'negotiation',
        status: 'open',
        description: 'New commercial complex development project'
      }
    ]);
    console.log('✅ Sample deals created');

    // Create sample tasks
    await Task.bulkCreate([
      {
        title: 'Schedule property inspection',
        description: 'Arrange inspection for downtown condo unit',
        priority: 'high',
        status: 'pending',
        assignedUserId: adminExists?.id || (await User.findOne())?.id,
        contactId: sampleContacts[0].id
      },
      {
        title: 'Review development permits',
        description: 'Check all permits are in order for new project',
        priority: 'medium',
        status: 'pending',
        assignedUserId: adminExists?.id || (await User.findOne())?.id,
        contactId: sampleContacts[1].id
      }
    ]);
    console.log('✅ Sample tasks created');

    // Create sample activities
    await Activity.bulkCreate([
      {
        title: 'Called about property availability',
        type: 'call',
        description: 'Discussed available units and pricing',
        contactId: sampleContacts[0].id,
        userId: adminExists?.id || (await User.findOne())?.id
      },
      {
        title: 'Sent development proposal',
        type: 'email',
        description: 'Emailed detailed proposal and timeline',
        contactId: sampleContacts[1].id,
        userId: adminExists?.id || (await User.findOne())?.id
      }
    ]);
    console.log('✅ Sample activities created');
    
    console.log('🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('Setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupDatabase };