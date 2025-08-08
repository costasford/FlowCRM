const { sequelize, User, Company, Contact, Deal, Task, Activity, LeadScore } = require('../models');

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...');
    
    // Authenticate connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync all models - this will create tables if they don't exist
    await sequelize.sync({ alter: true });
    console.log('✅ Database tables synchronized');
    
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
    
    // Create sample data if no companies exist
    const companyCount = await Company.count();
    if (companyCount === 0) {
      await Company.bulkCreate([
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
    }
    
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