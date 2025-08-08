const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { setupDatabase } = require('../scripts/setup-database');
const router = express.Router();

// One-time setup endpoint to create admin user
// POST /api/setup/database - Initialize complete database
router.post('/database', async (req, res) => {
  try {
    await setupDatabase();
    res.json({ 
      message: 'Database setup completed successfully',
      note: 'All tables created and sample data added'
    });
  } catch (error) {
    console.error('Database setup error:', error);
    res.status(500).json({ 
      error: 'Failed to setup database',
      details: error.message 
    });
  }
});

// POST /api/setup/test - Test what tables exist
router.post('/test', async (req, res) => {
  try {
    const { sequelize, User, Company, Contact, Deal, Task, Activity } = require('../models');
    
    const results = {};
    
    try {
      results.userCount = await User.count();
      results.users = 'EXISTS';
    } catch (e) {
      results.users = 'MISSING';
    }
    
    try {
      results.companyCount = await Company.count();
      results.companies = 'EXISTS';
    } catch (e) {
      results.companies = 'MISSING';
    }
    
    try {
      results.contactCount = await Contact.count();
      results.contacts = 'EXISTS';
    } catch (e) {
      results.contacts = 'MISSING';
    }
    
    try {
      results.dealCount = await Deal.count();
      results.deals = 'EXISTS';
    } catch (e) {
      results.deals = 'MISSING';
    }
    
    try {
      results.taskCount = await Task.count();
      results.tasks = 'EXISTS';
    } catch (e) {
      results.tasks = 'MISSING';
    }
    
    try {
      results.activityCount = await Activity.count();
      results.activities = 'EXISTS';
    } catch (e) {
      results.activities = 'MISSING';
    }
    
    res.json({ 
      message: 'Table status check completed',
      results
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ 
      error: 'Failed to test database',
      details: error.message 
    });
  }
});

router.post('/create-admin', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      where: { email: 'admin@flowcrm.com' } 
    });
    
    if (existingAdmin) {
      return res.status(400).json({ 
        error: 'Admin user already exists' 
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@flowcrm.com',
      passwordHash: hashedPassword,
      role: 'admin'
    });

    res.json({ 
      message: 'Admin user created successfully',
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
    
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ 
      error: 'Failed to create admin user',
      details: error.message 
    });
  }
});

module.exports = router;