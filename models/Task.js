'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.User, {
        foreignKey: 'assignedUserId',
        as: 'assignedUser'
      });
      Task.belongsTo(models.Contact, {
        foreignKey: 'contactId',
        as: 'contact'
      });
      Task.belongsTo(models.Deal, {
        foreignKey: 'dealId',
        as: 'deal'
      });
    }
  }

  Task.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    assignedUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium',
      allowNull: false
    },
    contactId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'contacts',
        key: 'id'
      }
    },
    dealId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'deals',
        key: 'id'
      }
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estimatedHours: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    }
  }, {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    timestamps: true,
    indexes: [
      {
        fields: ['assignedUserId']
      },
      {
        fields: ['contactId']
      },
      {
        fields: ['dealId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['dueDate']
      },
      {
        fields: ['priority']
      }
    ]
  });

  return Task;
};