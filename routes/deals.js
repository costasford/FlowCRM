const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { Deal, Contact, Company } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticateToken);

// Validation rules for property management deals (leases, renewals, maintenance contracts, etc.)
const dealValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Deal title is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  body('contactId')
    .optional()
    .isUUID()
    .withMessage('Contact ID must be a valid UUID'),
  body('companyId')
    .optional()
    .isUUID()
    .withMessage('Company ID must be a valid UUID'),
  body('stage')
    .isIn(['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'])
    .withMessage('Invalid stage'),
  body('value')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('Value must be a valid decimal number'),
  body('probability')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Probability must be between 0 and 100'),
  body('closeDate')
    .optional()
    .isISO8601()
    .withMessage('Close date must be a valid date'),
  body('status')
    .isIn(['open', 'won', 'lost', 'on_hold'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority')
];

// GET /api/deals - Get all deals with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim(),
  query('stage').optional().isIn(['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost']),
  query('status').optional().isIn(['open', 'won', 'lost', 'on_hold']),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  query('contactId').optional().isUUID(),
  query('companyId').optional().isUUID()
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
      stage,
      status,
      priority,
      contactId,
      companyId
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (stage) whereClause.stage = stage;
    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;
    if (contactId) whereClause.contactId = contactId;
    if (companyId) whereClause.companyId = companyId;

    const { count, rows: deals } = await Deal.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Contact,
          as: 'contact',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'location']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      deals,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalCount: count,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get deals error:', error);
    res.status(500).json({
      error: 'Failed to retrieve deals',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/deals/pipeline - Get deals grouped by stage for Kanban board
router.get('/pipeline', async (req, res) => {
  try {
    const deals = await Deal.findAll({
      where: { status: 'open' },
      include: [
        {
          model: Contact,
          as: 'contact',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'location']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Group deals by stage
    const pipeline = {
      lead: deals.filter(deal => deal.stage === 'lead'),
      qualified: deals.filter(deal => deal.stage === 'qualified'),
      proposal: deals.filter(deal => deal.stage === 'proposal'),
      negotiation: deals.filter(deal => deal.stage === 'negotiation'),
      closed_won: deals.filter(deal => deal.stage === 'closed_won'),
      closed_lost: deals.filter(deal => deal.stage === 'closed_lost')
    };

    // Calculate statistics
    const stats = {
      totalDeals: deals.length,
      totalValue: deals.reduce((sum, deal) => sum + (parseFloat(deal.value) || 0), 0),
      avgDealSize: deals.length > 0 ? deals.reduce((sum, deal) => sum + (parseFloat(deal.value) || 0), 0) / deals.length : 0,
      stageDistribution: Object.keys(pipeline).map(stage => ({
        stage,
        count: pipeline[stage].length,
        value: pipeline[stage].reduce((sum, deal) => sum + (parseFloat(deal.value) || 0), 0)
      }))
    };

    res.json({
      pipeline,
      stats
    });

  } catch (error) {
    console.error('Get pipeline error:', error);
    res.status(500).json({
      error: 'Failed to retrieve pipeline data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/deals/:id - Get single deal
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deal = await Deal.findByPk(id, {
      include: [
        {
          model: Contact,
          as: 'contact'
        },
        {
          model: Company,
          as: 'company'
        }
      ]
    });

    if (!deal) {
      return res.status(404).json({
        error: 'Deal not found'
      });
    }

    res.json({ deal });

  } catch (error) {
    console.error('Get deal error:', error);
    res.status(500).json({
      error: 'Failed to retrieve deal',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/deals - Create new deal
router.post('/', dealValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const deal = await Deal.create(req.body);

    // Load the deal with associations
    const fullDeal = await Deal.findByPk(deal.id, {
      include: [
        {
          model: Contact,
          as: 'contact'
        },
        {
          model: Company,
          as: 'company'
        }
      ]
    });

    res.status(201).json({
      message: 'Deal created successfully',
      deal: fullDeal
    });

  } catch (error) {
    console.error('Create deal error:', error);
    res.status(500).json({
      error: 'Failed to create deal',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/deals/:id - Update deal
router.put('/:id', dealValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const deal = await Deal.findByPk(id);

    if (!deal) {
      return res.status(404).json({
        error: 'Deal not found'
      });
    }

    await deal.update(req.body);

    // Load updated deal with associations
    const updatedDeal = await Deal.findByPk(id, {
      include: [
        {
          model: Contact,
          as: 'contact'
        },
        {
          model: Company,
          as: 'company'
        }
      ]
    });

    res.json({
      message: 'Deal updated successfully',
      deal: updatedDeal
    });

  } catch (error) {
    console.error('Update deal error:', error);
    res.status(500).json({
      error: 'Failed to update deal',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/deals/:id/stage - Update deal stage (for Kanban drag & drop)
router.put('/:id/stage', [
  body('stage')
    .isIn(['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'])
    .withMessage('Invalid stage')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const { stage } = req.body;

    const deal = await Deal.findByPk(id);
    if (!deal) {
      return res.status(404).json({
        error: 'Deal not found'
      });
    }

    // Update status based on stage
    let status = deal.status;
    if (stage === 'closed_won') {
      status = 'won';
    } else if (stage === 'closed_lost') {
      status = 'lost';
    } else if (status === 'won' || status === 'lost') {
      status = 'open'; // Reopening a closed deal
    }

    await deal.update({ stage, status });

    res.json({
      message: 'Deal stage updated successfully',
      deal
    });

  } catch (error) {
    console.error('Update deal stage error:', error);
    res.status(500).json({
      error: 'Failed to update deal stage',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/deals/:id - Delete deal
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deal = await Deal.findByPk(id);

    if (!deal) {
      return res.status(404).json({
        error: 'Deal not found'
      });
    }

    await deal.destroy();

    res.json({
      message: 'Deal deleted successfully'
    });

  } catch (error) {
    console.error('Delete deal error:', error);
    res.status(500).json({
      error: 'Failed to delete deal',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;