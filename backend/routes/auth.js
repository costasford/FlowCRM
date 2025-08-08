const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const router = express.Router();

// Validation rules
const registerValidation = [
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
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['admin', 'manager', 'agent', 'user'])
    .withMessage('Role must be admin, manager, agent, or user')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

// POST /api/auth/register - Register new user
router.post('/register', registerValidation, async (req, res) => {
  try {
    // Check for validation errors
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

    // Generate token
    const token = generateToken(user);

    // Update last login
    await user.update({ lastLoginAt: new Date() });

    res.status(201).json({
      message: 'User registered successfully',
      token, // Return token in response body for localStorage
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      error: 'Failed to register user',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/auth/login - Login user
router.post('/login', loginValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user);

    // Update last login
    await user.update({ lastLoginAt: new Date() });

    res.json({
      message: 'Login successful',
      token, // Return token in response body for localStorage
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Failed to login',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/auth/me - Get current user profile
router.get('/me', async (req, res) => {
  try {
    // Try to get token from cookie first, then fallback to Authorization header
    let token = req.cookies?.authToken;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    }

    if (!token) {
      return res.status(401).json({
        error: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Invalid token'
      });
    }

    res.json({
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(401).json({
      error: 'Invalid token'
    });
  }
});

// POST /api/auth/logout - Logout user (localStorage handles token removal)
router.post('/logout', (req, res) => {
  // With localStorage tokens, logout is handled client-side
  // This endpoint can be used for server-side cleanup if needed
  res.json({
    message: 'Logged out successfully'
  });
});

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email } = req.body;

    // Find user
    const user = await User.findOne({ where: { email, isActive: true } });
    
    // Always return success for security (don't reveal if user exists)
    if (!user) {
      return res.json({
        message: 'If an account with this email exists, you will receive password reset instructions.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now

    // Save reset token
    await user.update({
      passwordResetToken: resetToken,
      passwordResetTokenExpires: tokenExpires
    });

    // In a real app, you would send an email here
    // For now, we'll just return success with the token for testing
    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.json({
      message: 'If an account with this email exists, you will receive password reset instructions.',
      // Remove this token from response in production - only for testing
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      error: 'Failed to process password reset request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/auth/reset-password - Reset password with token
router.post('/reset-password', [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { token, password } = req.body;

    // Find user with valid reset token
    const user = await User.findOne({
      where: {
        passwordResetToken: token,
        passwordResetTokenExpires: {
          [require('sequelize').Op.gt]: new Date()
        },
        isActive: true
      }
    });

    if (!user) {
      return res.status(400).json({
        error: 'Invalid or expired reset token'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Update password and clear reset token
    await user.update({
      passwordHash,
      passwordResetToken: null,
      passwordResetTokenExpires: null
    });

    res.json({
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      error: 'Failed to reset password',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;