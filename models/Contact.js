'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    static associate(models) {
      Contact.belongsTo(models.Company, {
        foreignKey: 'companyId',
        as: 'company'
      });
      Contact.hasMany(models.Deal, {
        foreignKey: 'contactId',
        as: 'deals'
      });
      Contact.hasMany(models.Activity, {
        foreignKey: 'contactId',
        as: 'activities'
      });
      Contact.hasMany(models.Task, {
        foreignKey: 'contactId',
        as: 'tasks'
      });
      Contact.hasOne(models.LeadScore, {
        foreignKey: 'contactId',
        as: 'leadScore'
      });
    }
  }

  Contact.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 20]
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
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      allowNull: false
    },
    source: {
      type: DataTypes.ENUM('website', 'referral', 'social_media', 'cold_call', 'email_campaign', 'trade_show', 'other'),
      allowNull: true,
      defaultValue: 'other'
    },
    lastContacted: {
      type: DataTypes.DATE,
      allowNull: true
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 100]
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Contact',
    tableName: 'contacts',
    timestamps: true,
    indexes: [
      {
        fields: ['email']
      },
      {
        fields: ['companyId']
      },
      {
        fields: ['source']
      },
      {
        fields: ['tags']
      }
    ]
  });

  return Contact;
};