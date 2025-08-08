'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    static associate(models) {
      Activity.belongsTo(models.Contact, {
        foreignKey: 'contactId',
        as: 'contact'
      });
      Activity.belongsTo(models.Deal, {
        foreignKey: 'dealId',
        as: 'deal'
      });
    }
  }

  Activity.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM('call', 'email', 'meeting', 'note', 'task_completed', 'deal_update', 'other'),
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
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 500]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    outcome: {
      type: DataTypes.ENUM('positive', 'neutral', 'negative', 'no_response'),
      allowNull: true
    },
    duration: {
      type: DataTypes.INTEGER, // in minutes
      allowNull: true,
      validate: {
        min: 0
      }
    }
  }, {
    sequelize,
    modelName: 'Activity',
    tableName: 'activities',
    timestamps: true,
    indexes: [
      {
        fields: ['contactId']
      },
      {
        fields: ['dealId']
      },
      {
        fields: ['type']
      },
      {
        fields: ['timestamp']
      }
    ]
  });

  return Activity;
};