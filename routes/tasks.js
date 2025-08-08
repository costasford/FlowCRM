const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { Task, User, Contact, Deal } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticateToken);

// Validation rules for property management tasks
const taskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
  body('assignedUserId')
    .isUUID()
    .withMessage('Assigned user ID must be a valid UUID'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority'),
  body('contactId')
    .optional()
    .isUUID()
    .withMessage('Contact ID must be a valid UUID'),
  body('dealId')
    .optional()
    .isUUID()
    .withMessage('Deal ID must be a valid UUID'),
  body('estimatedHours')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('Estimated hours must be a valid decimal number')
];

// GET /api/tasks - Get all tasks with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim(),
  query('status').optional().isIn(['pending', 'in_progress', 'completed', 'cancelled']),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  query('assignedUserId').optional().isUUID(),
  query('contactId').optional().isUUID(),
  query('dealId').optional().isUUID(),
  query('overdue').optional().isBoolean(),
  query('dueSoon').optional().isBoolean() // Due within 7 days
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
      status,
      priority,
      assignedUserId,
      contactId,
      dealId,
      overdue,
      dueSoon
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

    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;
    if (assignedUserId) whereClause.assignedUserId = assignedUserId;
    if (contactId) whereClause.contactId = contactId;
    if (dealId) whereClause.dealId = dealId;

    // Special date filters
    const now = new Date();
    if (overdue === 'true') {
      whereClause.dueDate = { [Op.lt]: now };
      whereClause.status = { [Op.ne]: 'completed' };
    }

    if (dueSoon === 'true') {
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      whereClause.dueDate = { 
        [Op.between]: [now, weekFromNow] 
      };
      whereClause.status = { [Op.ne]: 'completed' };
    }

    const { count, rows: tasks } = await Task.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'name', 'email']
        },
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
      order: [
        ['priority', 'ASC'], // urgent, high, medium, low
        ['dueDate', 'ASC'],
        ['createdAt', 'DESC']
      ],
      limit: parseInt(limit),
      offset
    });

    // Add computed fields
    const tasksWithStatus = tasks.map(task => {
      const taskData = task.toJSON();
      const now = new Date();
      
      taskData.isOverdue = taskData.dueDate && new Date(taskData.dueDate) < now && taskData.status !== 'completed';
      taskData.isDueSoon = taskData.dueDate && 
        new Date(taskData.dueDate) >= now && 
        new Date(taskData.dueDate) <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) &&
        taskData.status !== 'completed';
      
      return taskData;
    });

    res.json({
      tasks: tasksWithStatus,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalCount: count,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      error: 'Failed to retrieve tasks',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/tasks/dashboard - Get task dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    // Get task counts
    const [totalTasks, pendingTasks, inProgressTasks, completedTasks, overdueTasks, dueSoonTasks] = await Promise.all([
      Task.count({ where: { assignedUserId: userId } }),
      Task.count({ where: { assignedUserId: userId, status: 'pending' } }),
      Task.count({ where: { assignedUserId: userId, status: 'in_progress' } }),
      Task.count({ where: { assignedUserId: userId, status: 'completed' } }),
      Task.count({ 
        where: { 
          assignedUserId: userId,
          dueDate: { [Op.lt]: now },
          status: { [Op.ne]: 'completed' }
        } 
      }),
      Task.count({ 
        where: { 
          assignedUserId: userId,
          dueDate: { [Op.between]: [now, weekFromNow] },
          status: { [Op.ne]: 'completed' }
        } 
      })
    ]);

    // Get recent tasks
    const recentTasks = await Task.findAll({
      where: { 
        assignedUserId: userId,
        status: { [Op.ne]: 'completed' }
      },
      include: [
        {
          model: Contact,
          as: 'contact',
          attributes: ['id', 'name']
        },
        {
          model: Deal,
          as: 'deal',
          attributes: ['id', 'title']
        }
      ],
      order: [
        ['priority', 'ASC'],
        ['dueDate', 'ASC'],
        ['createdAt', 'DESC']
      ],
      limit: 10
    });

    res.json({
      stats: {
        total: totalTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
        overdue: overdueTasks,
        dueSoon: dueSoonTasks
      },
      recentTasks
    });

  } catch (error) {
    console.error('Get task dashboard error:', error);
    res.status(500).json({
      error: 'Failed to retrieve task dashboard data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/tasks/:id - Get single task
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id, {
      include: [
        {
          model: User,
          as: 'assignedUser'
        },
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

    if (!task) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }

    res.json({ task });

  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      error: 'Failed to retrieve task',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/tasks - Create new task
router.post('/', taskValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const task = await Task.create(req.body);

    // Load the task with associations
    const fullTask = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'assignedUser'
        },
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

    res.status(201).json({
      message: 'Task created successfully',
      task: fullTask
    });

  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      error: 'Failed to create task',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', taskValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }

    // Set completion timestamp if status changed to completed
    const updateData = { ...req.body };
    if (req.body.status === 'completed' && task.status !== 'completed') {
      updateData.completedAt = new Date();
    } else if (req.body.status !== 'completed') {
      updateData.completedAt = null;
    }

    await task.update(updateData);

    // Load updated task with associations
    const updatedTask = await Task.findByPk(id, {
      include: [
        {
          model: User,
          as: 'assignedUser'
        },
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
      message: 'Task updated successfully',
      task: updatedTask
    });

  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      error: 'Failed to update task',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/tasks/:id/complete - Mark task as completed
router.put('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }

    await task.update({
      status: 'completed',
      completedAt: new Date()
    });

    res.json({
      message: 'Task marked as completed',
      task
    });

  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({
      error: 'Failed to complete task',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }

    await task.destroy();

    res.json({
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      error: 'Failed to delete task',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;