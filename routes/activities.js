const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { Activity, Contact, Deal } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticateToken);

// Validation rules for property management activities
const activityValidation = [
  body('type')
    .isIn(['call', 'email', 'meeting', 'note', 'task_completed', 'deal_update', 'other'])
    .withMessage('Invalid activity type'),
  body('contactId')
    .optional()
    .isUUID()
    .withMessage('Contact ID must be a valid UUID'),
  body('dealId')
    .optional()
    .isUUID()
    .withMessage('Deal ID must be a valid UUID'),
  body('summary')
    .trim()
    .notEmpty()
    .withMessage('Summary is required')
    .isLength({ min: 1, max: 500 })
    .withMessage('Summary must be between 1 and 500 characters'),
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
  body('outcome')
    .optional()
    .isIn(['positive', 'neutral', 'negative', 'no_response'])
    .withMessage('Invalid outcome'),
  body('duration')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Duration must be a positive integer (minutes)')
];

// GET /api/activities - Get all activities with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim(),
  query('type').optional().isIn(['call', 'email', 'meeting', 'note', 'task_completed', 'deal_update', 'other']),
  query('outcome').optional().isIn(['positive', 'neutral', 'negative', 'no_response']),
  query('contactId').optional().isUUID(),
  query('dealId').optional().isUUID(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
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
      type,
      outcome,
      contactId,
      dealId,
      startDate,
      endDate
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { summary: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (type) whereClause.type = type;
    if (outcome) whereClause.outcome = outcome;
    if (contactId) whereClause.contactId = contactId;
    if (dealId) whereClause.dealId = dealId;

    // Date range filtering
    if (startDate || endDate) {
      whereClause.timestamp = {};
      if (startDate) whereClause.timestamp[Op.gte] = new Date(startDate);
      if (endDate) whereClause.timestamp[Op.lte] = new Date(endDate);
    }

    const { count, rows: activities } = await Activity.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Contact,
          as: 'contact',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Deal,
          as: 'deal',
          attributes: ['id', 'title', 'stage', 'value']
        }
      ],
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      activities,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalCount: count,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({
      error: 'Failed to retrieve activities',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/activities/timeline - Get timeline view of recent activities
router.get('/timeline', [
  query('days').optional().isInt({ min: 1, max: 365 }).withMessage('Days must be between 1 and 365'),
  query('contactId').optional().isUUID(),
  query('dealId').optional().isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { days = 30, contactId, dealId } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const whereClause = {
      timestamp: { [Op.gte]: startDate }
    };

    if (contactId) whereClause.contactId = contactId;
    if (dealId) whereClause.dealId = dealId;

    const activities = await Activity.findAll({
      where: whereClause,
      include: [
        {
          model: Contact,
          as: 'contact',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Deal,
          as: 'deal',
          attributes: ['id', 'title', 'stage']
        }
      ],
      order: [['timestamp', 'DESC']],
      limit: 100
    });

    // Group activities by date
    const groupedActivities = activities.reduce((groups, activity) => {
      const date = activity.timestamp.toISOString().split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
      return groups;
    }, {});

    res.json({
      timeline: groupedActivities,
      stats: {
        totalActivities: activities.length,
        periodDays: parseInt(days),
        avgPerDay: (activities.length / parseInt(days)).toFixed(1)
      }
    });

  } catch (error) {
    console.error('Get timeline error:', error);
    res.status(500).json({
      error: 'Failed to retrieve timeline',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/activities/:id - Get single activity
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findByPk(id, {
      include: [
        {
          model: Contact,
          as: 'contact'
        },
        {
          model: Deal,
          as: 'deal'
        }
      ]
    });

    if (!activity) {
      return res.status(404).json({
        error: 'Activity not found'
      });
    }

    res.json({ activity });

  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      error: 'Failed to retrieve activity',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/activities - Create new activity
router.post('/', activityValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // Set timestamp if not provided
    const activityData = {
      ...req.body,
      timestamp: req.body.timestamp || new Date()
    };

    const activity = await Activity.create(activityData);

    // Load the activity with associations
    const fullActivity = await Activity.findByPk(activity.id, {
      include: [
        {
          model: Contact,
          as: 'contact'
        },
        {
          model: Deal,
          as: 'deal'
        }
      ]
    });

    // Update lastContacted for contact if applicable
    if (activity.contactId && ['call', 'email', 'meeting'].includes(activity.type)) {
      await Contact.update(
        { lastContacted: activity.timestamp },
        { where: { id: activity.contactId } }
      );
    }

    res.status(201).json({
      message: 'Activity created successfully',
      activity: fullActivity
    });

  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({
      error: 'Failed to create activity',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/activities/:id - Update activity
router.put('/:id', activityValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const activity = await Activity.findByPk(id);

    if (!activity) {
      return res.status(404).json({
        error: 'Activity not found'
      });
    }

    await activity.update(req.body);

    // Load updated activity with associations
    const updatedActivity = await Activity.findByPk(id, {
      include: [
        {
          model: Contact,
          as: 'contact'
        },
        {
          model: Deal,
          as: 'deal'
        }
      ]
    });

    res.json({
      message: 'Activity updated successfully',
      activity: updatedActivity
    });

  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({
      error: 'Failed to update activity',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/activities/:id - Delete activity
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findByPk(id);

    if (!activity) {
      return res.status(404).json({
        error: 'Activity not found'
      });
    }

    await activity.destroy();

    res.json({
      message: 'Activity deleted successfully'
    });

  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({
      error: 'Failed to delete activity',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;