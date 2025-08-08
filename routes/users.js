const express = require('express');
const bcrypt = require('bcryptjs');
const { body, query, validationResult } = require('express-validator');
const { User } = require('../models');
const { authenticateToken, requireManagerOrAdmin, requireAdmin } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticateToken);

// Validation rules
const userValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be between 1 and 255 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('role')
    .optional()
    .isIn(['admin', 'manager', 'user'])
    .withMessage('Role must be admin, manager, or user'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// GET /api/users - Get all users (managers and admins only)
router.get('/', requireManagerOrAdmin, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim(),
  query('role').optional().isIn(['admin', 'manager', 'user']),
  query('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      page = 1,
      limit = 20,
      search,
      role,
      isActive
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (role) whereClause.role = role;
    if (isActive !== undefined) whereClause.isActive = isActive === 'true';

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['passwordHash'] },
      order: [['name', 'ASC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalCount: count,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Failed to retrieve users',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/users/me - Get current user profile
router.get('/me', async (req, res) => {
  try {
    res.json({
      user: req.user.toJSON()
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      error: 'Failed to retrieve user profile',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/users/:id - Get single user (managers and admins only)
router.get('/:id', requireManagerOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['passwordHash'] }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({ user });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to retrieve user',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/users - Create new user (admins only)
router.post('/', requireAdmin, userValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name, email, password, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash,
      role
    });

    res.status(201).json({
      message: 'User created successfully',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      error: 'Failed to create user',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/users/:id - Update user (admins only, or self for basic info)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;

    // Users can only update themselves, unless they're admin
    if (currentUser.id !== id && currentUser.role !== 'admin') {
      return res.status(403).json({
        error: 'You can only update your own profile'
      });
    }

    // Validation - different rules for self vs admin updating others
    const isSelfUpdate = currentUser.id === id;
    const allowedFields = isSelfUpdate 
      ? ['name', 'email', 'password'] 
      : ['name', 'email', 'password', 'role', 'isActive'];

    // Filter out disallowed fields
    const updateData = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    // Validate the filtered data
    const validationRules = [
      body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 1, max: 255 })
        .withMessage('Name must be between 1 and 255 characters'),
      body('email')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
      body('role')
        .optional()
        .isIn(['admin', 'manager', 'user'])
        .withMessage('Role must be admin, manager, or user'),
      body('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
      body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean')
    ];

    // Apply validation
    await Promise.all(validationRules.map(rule => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Hash password if provided
    if (updateData.password) {
      const saltRounds = 12;
      updateData.passwordHash = await bcrypt.hash(updateData.password, saltRounds);
      delete updateData.password;
    }

    // Check email uniqueness if email is being changed
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({ 
        where: { 
          email: updateData.email,
          id: { [Op.ne]: id }
        }
      });
      if (existingUser) {
        return res.status(409).json({
          error: 'User with this email already exists'
        });
      }
    }

    await user.update(updateData);

    res.json({
      message: 'User updated successfully',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      error: 'Failed to update user',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/users/:id/deactivate - Deactivate user (admins only)
router.put('/:id/deactivate', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Don't allow deactivating yourself
    if (req.user.id === id) {
      return res.status(400).json({
        error: 'You cannot deactivate your own account'
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    await user.update({ isActive: false });

    res.json({
      message: 'User deactivated successfully',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      error: 'Failed to deactivate user',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/users/:id/activate - Activate user (admins only)
router.put('/:id/activate', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    await user.update({ isActive: true });

    res.json({
      message: 'User activated successfully',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({
      error: 'Failed to activate user',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/users/:id - Hard delete user (admins only, use with caution)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Don't allow deleting yourself
    if (req.user.id === id) {
      return res.status(400).json({
        error: 'You cannot delete your own account'
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Note: This is a hard delete. In production, you might want to:
    // 1. Check if user has associated data (tasks, activities, etc.)
    // 2. Consider soft delete instead
    // 3. Reassign user's tasks to someone else first

    await user.destroy();

    res.json({
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: 'Failed to delete user',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;