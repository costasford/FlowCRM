const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const router = express.Router();

// One-time setup endpoint to create admin user
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
      firstName: 'Admin',
      lastName: 'User', 
      email: 'admin@flowcrm.com',
      password: hashedPassword,
      role: 'admin'
    });

    res.json({ 
      message: 'Admin user created successfully',
      user: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
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