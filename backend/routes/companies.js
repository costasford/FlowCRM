const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { Company, Contact, Deal } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticateToken);

// Validation rules
const companyValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Company/Property name is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be between 1 and 255 characters'),
  body('industry')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Industry must be less than 100 characters'),
  body('size')
    .optional()
    .isIn(['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'])
    .withMessage('Invalid company size'),
  body('location')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Location must be less than 255 characters'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Website must be a valid URL'),
  body('revenue')
    .optional()
    .isDecimal()
    .withMessage('Revenue must be a valid decimal number')
];

// GET /api/companies - Get all companies/properties with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim(),
  query('industry').optional().trim(),
  query('size').optional().isIn(['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'])
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
      industry,
      size
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const whereClause = { isActive: true };

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
        { notes: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (industry) {
      whereClause.industry = { [Op.iLike]: `%${industry}%` };
    }

    if (size) {
      whereClause.size = size;
    }

    const { count, rows: companies } = await Company.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Contact,
          as: 'contacts',
          where: { isActive: true },
          required: false,
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: Deal,
          as: 'deals',
          required: false,
          attributes: ['id', 'title', 'stage', 'value', 'status']
        }
      ],
      order: [['name', 'ASC']],
      limit: parseInt(limit),
      offset
    });

    // Add summary statistics for each company
    const companiesWithStats = companies.map(company => {
      const companyData = company.toJSON();
      companyData.stats = {
        contactCount: companyData.contacts?.length || 0,
        dealCount: companyData.deals?.length || 0,
        totalDealValue: companyData.deals?.reduce((sum, deal) => 
          sum + (parseFloat(deal.value) || 0), 0) || 0,
        activeDealCount: companyData.deals?.filter(deal => 
          deal.status === 'open').length || 0
      };
      return companyData;
    });

    res.json({
      companies: companiesWithStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalCount: count,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({
      error: 'Failed to retrieve companies',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/companies/:id - Get single company/property
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findOne({
      where: { id, isActive: true },
      include: [
        {
          model: Contact,
          as: 'contacts',
          where: { isActive: true },
          required: false
        },
        {
          model: Deal,
          as: 'deals',
          required: false
        }
      ]
    });

    if (!company) {
      return res.status(404).json({
        error: 'Company/Property not found'
      });
    }

    // Add summary statistics
    const companyData = company.toJSON();
    companyData.stats = {
      contactCount: companyData.contacts?.length || 0,
      dealCount: companyData.deals?.length || 0,
      totalDealValue: companyData.deals?.reduce((sum, deal) => 
        sum + (parseFloat(deal.value) || 0), 0) || 0,
      activeDealCount: companyData.deals?.filter(deal => 
        deal.status === 'open').length || 0
    };

    res.json({ company: companyData });

  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({
      error: 'Failed to retrieve company',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/companies - Create new company/property
router.post('/', companyValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const company = await Company.create(req.body);

    res.status(201).json({
      message: 'Company/Property created successfully',
      company
    });

  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({
      error: 'Failed to create company',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/companies/:id - Update company/property
router.put('/:id', companyValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;

    const company = await Company.findOne({
      where: { id, isActive: true }
    });

    if (!company) {
      return res.status(404).json({
        error: 'Company/Property not found'
      });
    }

    await company.update(req.body);

    res.json({
      message: 'Company/Property updated successfully',
      company
    });

  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({
      error: 'Failed to update company',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/companies/:id - Soft delete company/property
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findOne({
      where: { id, isActive: true }
    });

    if (!company) {
      return res.status(404).json({
        error: 'Company/Property not found'
      });
    }

    // Soft delete
    await company.update({ isActive: false });

    res.json({
      message: 'Company/Property deleted successfully'
    });

  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({
      error: 'Failed to delete company',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;