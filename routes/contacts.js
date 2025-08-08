const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { Contact, Company, LeadScore } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticateToken);

// Validation rules
const contactValidation = [
  body('name')
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
  body('phone')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Phone number must be less than 20 characters'),
  body('companyId')
    .optional()
    .isUUID()
    .withMessage('Company ID must be a valid UUID'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('source')
    .optional()
    .isIn(['website', 'referral', 'social_media', 'cold_call', 'email_campaign', 'trade_show', 'other'])
    .withMessage('Invalid source value'),
  body('position')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Position must be less than 100 characters')
];

// GET /api/contacts - Get all contacts with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim(),
  query('companyId').optional().isUUID().withMessage('Company ID must be a valid UUID'),
  query('source').optional().isIn(['website', 'referral', 'social_media', 'cold_call', 'email_campaign', 'trade_show', 'other']),
  query('tags').optional()
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
      companyId,
      source,
      tags
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const whereClause = { isActive: true };

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (companyId) {
      whereClause.companyId = companyId;
    }

    if (source) {
      whereClause.source = source;
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      whereClause.tags = { [Op.overlap]: tagArray };
    }

    const { count, rows: contacts } = await Contact.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'industry']
        },
        {
          model: LeadScore,
          as: 'leadScore',
          attributes: ['score', 'grade']
        }
      ],
      order: [['name', 'ASC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      contacts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalCount: count,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      error: 'Failed to retrieve contacts',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/contacts/:id - Get single contact
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findOne({
      where: { id, isActive: true },
      include: [
        {
          model: Company,
          as: 'company'
        },
        {
          model: LeadScore,
          as: 'leadScore'
        }
      ]
    });

    if (!contact) {
      return res.status(404).json({
        error: 'Contact not found'
      });
    }

    res.json({ contact });

  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      error: 'Failed to retrieve contact',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/contacts - Create new contact
router.post('/', contactValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const contactData = {
      ...req.body,
      tags: req.body.tags || []
    };

    const contact = await Contact.create(contactData);

    // Load the contact with associations
    const fullContact = await Contact.findByPk(contact.id, {
      include: [
        {
          model: Company,
          as: 'company'
        }
      ]
    });

    res.status(201).json({
      message: 'Contact created successfully',
      contact: fullContact
    });

  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({
      error: 'Failed to create contact',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/contacts/:id - Update contact
router.put('/:id', contactValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;

    const contact = await Contact.findOne({
      where: { id, isActive: true }
    });

    if (!contact) {
      return res.status(404).json({
        error: 'Contact not found'
      });
    }

    await contact.update(req.body);

    // Load updated contact with associations
    const updatedContact = await Contact.findByPk(id, {
      include: [
        {
          model: Company,
          as: 'company'
        },
        {
          model: LeadScore,
          as: 'leadScore'
        }
      ]
    });

    res.json({
      message: 'Contact updated successfully',
      contact: updatedContact
    });

  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      error: 'Failed to update contact',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/contacts/:id - Soft delete contact
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findOne({
      where: { id, isActive: true }
    });

    if (!contact) {
      return res.status(404).json({
        error: 'Contact not found'
      });
    }

    // Soft delete
    await contact.update({ isActive: false });

    res.json({
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      error: 'Failed to delete contact',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;