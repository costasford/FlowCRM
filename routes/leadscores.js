const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { LeadScore, Contact } = require('../models');
const { authenticateToken, requireManagerOrAdmin } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticateToken);

// Validation rules for lead scoring
const leadScoreValidation = [
  body('contactId')
    .isUUID()
    .withMessage('Contact ID must be a valid UUID'),
  body('score')
    .isInt({ min: 0, max: 100 })
    .withMessage('Score must be between 0 and 100'),
  body('factors')
    .optional()
    .isObject()
    .withMessage('Factors must be an object'),
  body('lastCalculated')
    .optional()
    .isISO8601()
    .withMessage('Last calculated must be a valid date')
];

// GET /api/leadscores - Get all lead scores with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('minScore').optional().isInt({ min: 0, max: 100 }),
  query('maxScore').optional().isInt({ min: 0, max: 100 }),
  query('contactId').optional().isUUID(),
  query('sortBy').optional().isIn(['score', 'lastCalculated', 'createdAt'])
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
      minScore,
      maxScore,
      contactId,
      sortBy = 'score'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const whereClause = {};

    if (minScore !== undefined) {
      whereClause.score = { ...whereClause.score, [Op.gte]: parseInt(minScore) };
    }
    if (maxScore !== undefined) {
      whereClause.score = { ...whereClause.score, [Op.lte]: parseInt(maxScore) };
    }
    if (contactId) {
      whereClause.contactId = contactId;
    }

    // Determine sort order
    const sortOrder = sortBy === 'score' ? 'DESC' : 'DESC'; // High scores first, recent dates first

    const { count, rows: leadScores } = await LeadScore.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Contact,
          as: 'contact',
          attributes: ['id', 'name', 'email', 'phone', 'source', 'tags'],
          where: { isActive: true }
        }
      ],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset
    });

    res.json({
      leadScores,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalCount: count,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get lead scores error:', error);
    res.status(500).json({
      error: 'Failed to retrieve lead scores',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/leadscores/analytics - Get lead scoring analytics and insights
router.get('/analytics', requireManagerOrAdmin, async (req, res) => {
  try {
    const [
      totalLeads,
      hotLeads,
      warmLeads,
      coldLeads,
      averageScore,
      scoreDistribution
    ] = await Promise.all([
      LeadScore.count(),
      LeadScore.count({ where: { score: { [Op.gte]: 80 } } }), // Hot leads: 80+
      LeadScore.count({ where: { score: { [Op.between]: [50, 79] } } }), // Warm leads: 50-79
      LeadScore.count({ where: { score: { [Op.lt]: 50 } } }), // Cold leads: <50
      LeadScore.findOne({
        attributes: [
          [require('sequelize').fn('AVG', require('sequelize').col('score')), 'average']
        ]
      }),
      LeadScore.findAll({
        attributes: [
          [require('sequelize').fn('COUNT', '*'), 'count'],
          [require('sequelize').literal(`
            CASE 
              WHEN score >= 80 THEN 'hot'
              WHEN score >= 50 THEN 'warm'
              ELSE 'cold'
            END
          `), 'category']
        ],
        group: [require('sequelize').literal(`
          CASE 
            WHEN score >= 80 THEN 'hot'
            WHEN score >= 50 THEN 'warm'
            ELSE 'cold'
          END
        `)]
      })
    ]);

    // Get recent high-scoring leads
    const recentHotLeads = await LeadScore.findAll({
      where: { 
        score: { [Op.gte]: 80 },
        createdAt: { 
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      include: [
        {
          model: Contact,
          as: 'contact',
          attributes: ['id', 'name', 'email', 'source']
        }
      ],
      order: [['score', 'DESC']],
      limit: 10
    });

    res.json({
      summary: {
        totalLeads,
        hotLeads,
        warmLeads,
        coldLeads,
        averageScore: Math.round(averageScore?.dataValues?.average || 0)
      },
      distribution: scoreDistribution,
      recentHotLeads,
      insights: {
        hotLeadPercentage: totalLeads > 0 ? Math.round((hotLeads / totalLeads) * 100) : 0,
        conversionOpportunity: warmLeads + coldLeads, // Leads that could be improved
        scoringHealth: averageScore?.dataValues?.average > 60 ? 'good' : 'needs_improvement'
      }
    });

  } catch (error) {
    console.error('Get lead score analytics error:', error);
    res.status(500).json({
      error: 'Failed to retrieve lead score analytics',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/leadscores/:id - Get single lead score
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const leadScore = await LeadScore.findByPk(id, {
      include: [
        {
          model: Contact,
          as: 'contact'
        }
      ]
    });

    if (!leadScore) {
      return res.status(404).json({
        error: 'Lead score not found'
      });
    }

    res.json({ leadScore });

  } catch (error) {
    console.error('Get lead score error:', error);
    res.status(500).json({
      error: 'Failed to retrieve lead score',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/leadscores/contact/:contactId - Get lead score for specific contact
router.get('/contact/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params;

    const leadScore = await LeadScore.findOne({
      where: { contactId },
      include: [
        {
          model: Contact,
          as: 'contact'
        }
      ]
    });

    if (!leadScore) {
      return res.status(404).json({
        error: 'Lead score not found for this contact'
      });
    }

    res.json({ leadScore });

  } catch (error) {
    console.error('Get contact lead score error:', error);
    res.status(500).json({
      error: 'Failed to retrieve contact lead score',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/leadscores - Create new lead score
router.post('/', leadScoreValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { contactId } = req.body;

    // Check if lead score already exists for this contact
    const existingScore = await LeadScore.findOne({ where: { contactId } });
    if (existingScore) {
      return res.status(409).json({
        error: 'Lead score already exists for this contact. Use PUT to update.'
      });
    }

    // Verify contact exists
    const contact = await Contact.findByPk(contactId);
    if (!contact) {
      return res.status(404).json({
        error: 'Contact not found'
      });
    }

    const leadScore = await LeadScore.create({
      ...req.body,
      lastCalculated: req.body.lastCalculated || new Date()
    });

    // Load the lead score with contact
    const fullLeadScore = await LeadScore.findByPk(leadScore.id, {
      include: [
        {
          model: Contact,
          as: 'contact'
        }
      ]
    });

    res.status(201).json({
      message: 'Lead score created successfully',
      leadScore: fullLeadScore
    });

  } catch (error) {
    console.error('Create lead score error:', error);
    res.status(500).json({
      error: 'Failed to create lead score',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/leadscores/:id - Update lead score
router.put('/:id', leadScoreValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const leadScore = await LeadScore.findByPk(id);

    if (!leadScore) {
      return res.status(404).json({
        error: 'Lead score not found'
      });
    }

    // Update lastCalculated if score changed
    const updateData = { ...req.body };
    if (req.body.score && req.body.score !== leadScore.score) {
      updateData.lastCalculated = new Date();
    }

    await leadScore.update(updateData);

    // Load updated lead score with contact
    const updatedLeadScore = await LeadScore.findByPk(id, {
      include: [
        {
          model: Contact,
          as: 'contact'
        }
      ]
    });

    res.json({
      message: 'Lead score updated successfully',
      leadScore: updatedLeadScore
    });

  } catch (error) {
    console.error('Update lead score error:', error);
    res.status(500).json({
      error: 'Failed to update lead score',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/leadscores/contact/:contactId - Update or create lead score for contact
router.put('/contact/:contactId', leadScoreValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { contactId } = req.params;

    // Verify contact exists
    const contact = await Contact.findByPk(contactId);
    if (!contact) {
      return res.status(404).json({
        error: 'Contact not found'
      });
    }

    const updateData = {
      ...req.body,
      contactId,
      lastCalculated: new Date()
    };

    // Use upsert to create or update
    const [leadScore, created] = await LeadScore.upsert(updateData, {
      returning: true
    });

    // Load with contact data
    const fullLeadScore = await LeadScore.findByPk(leadScore.id, {
      include: [
        {
          model: Contact,
          as: 'contact'
        }
      ]
    });

    res.json({
      message: created ? 'Lead score created successfully' : 'Lead score updated successfully',
      leadScore: fullLeadScore,
      created
    });

  } catch (error) {
    console.error('Upsert lead score error:', error);
    res.status(500).json({
      error: 'Failed to update lead score',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/leadscores/recalculate - Recalculate all lead scores (managers/admins only)
router.post('/recalculate', requireManagerOrAdmin, async (req, res) => {
  try {
    // This is a placeholder for lead scoring algorithm
    // In a real implementation, you would:
    // 1. Get all contacts
    // 2. Calculate scores based on various factors
    // 3. Update or create lead scores

    const contacts = await Contact.findAll({
      where: { isActive: true },
      attributes: ['id', 'source', 'tags', 'lastContacted', 'createdAt']
    });

    const results = {
      processed: 0,
      updated: 0,
      created: 0,
      errors: []
    };

    for (const contact of contacts) {
      try {
        results.processed++;
        
        // Simple scoring algorithm (replace with your business logic)
        let score = 0;
        
        // Score based on source
        const sourceScores = {
          'website': 20,
          'referral': 30,
          'social_media': 15,
          'cold_outreach': 10,
          'event': 25,
          'advertisement': 15
        };
        score += sourceScores[contact.source] || 10;

        // Score based on recency of contact
        if (contact.lastContacted) {
          const daysSinceContact = Math.floor((Date.now() - new Date(contact.lastContacted)) / (1000 * 60 * 60 * 24));
          if (daysSinceContact <= 7) score += 30;
          else if (daysSinceContact <= 30) score += 20;
          else if (daysSinceContact <= 90) score += 10;
        }

        // Score based on tags (property management specific)
        const tags = contact.tags || [];
        if (tags.includes('commercial')) score += 15;
        if (tags.includes('multi_unit')) score += 10;
        if (tags.includes('high_value')) score += 20;
        if (tags.includes('maintenance_contract')) score += 25;

        // Cap at 100
        score = Math.min(score, 100);

        const factors = {
          source: sourceScores[contact.source] || 10,
          recency: contact.lastContacted ? 'recent_contact' : 'no_contact',
          tags: tags,
          calculated_at: new Date().toISOString()
        };

        const [leadScore, created] = await LeadScore.upsert({
          contactId: contact.id,
          score,
          factors,
          lastCalculated: new Date()
        }, {
          returning: true
        });

        if (created) {
          results.created++;
        } else {
          results.updated++;
        }

      } catch (error) {
        results.errors.push({
          contactId: contact.id,
          error: error.message
        });
      }
    }

    res.json({
      message: 'Lead score recalculation completed',
      results
    });

  } catch (error) {
    console.error('Recalculate lead scores error:', error);
    res.status(500).json({
      error: 'Failed to recalculate lead scores',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/leadscores/:id - Delete lead score
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const leadScore = await LeadScore.findByPk(id);

    if (!leadScore) {
      return res.status(404).json({
        error: 'Lead score not found'
      });
    }

    await leadScore.destroy();

    res.json({
      message: 'Lead score deleted successfully'
    });

  } catch (error) {
    console.error('Delete lead score error:', error);
    res.status(500).json({
      error: 'Failed to delete lead score',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;