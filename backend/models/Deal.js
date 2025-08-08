'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Deal extends Model {
    static associate(models) {
      Deal.belongsTo(models.Contact, {
        foreignKey: 'contactId',
        as: 'contact'
      });
      Deal.belongsTo(models.Company, {
        foreignKey: 'companyId',
        as: 'company'
      });
      Deal.hasMany(models.Activity, {
        foreignKey: 'dealId',
        as: 'activities'
      });
      Deal.hasMany(models.Task, {
        foreignKey: 'dealId',
        as: 'tasks'
      });
    }
  }

  Deal.init({
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
    contactId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'contacts',
        key: 'id'
      }
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'companies',
        key: 'id'
      }
    },
    stage: {
      type: DataTypes.ENUM('lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'),
      allowNull: false,
      defaultValue: 'lead'
    },
    value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    probability: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      },
      defaultValue: 50
    },
    closeDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('open', 'won', 'lost', 'on_hold'),
      allowNull: false,
      defaultValue: 'open'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Deal',
    tableName: 'deals',
    timestamps: true,
    indexes: [
      {
        fields: ['contactId']
      },
      {
        fields: ['companyId']
      },
      {
        fields: ['stage']
      },
      {
        fields: ['status']
      },
      {
        fields: ['closeDate']
      }
    ]
  });

  return Deal;
};