'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      Company.hasMany(models.Contact, {
        foreignKey: 'companyId',
        as: 'contacts'
      });
      Company.hasMany(models.Deal, {
        foreignKey: 'companyId',
        as: 'deals'
      });
    }
  }

  Company.init({
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
    industry: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 100]
      }
    },
    size: {
      type: DataTypes.ENUM('1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 255]
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    revenue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Company',
    tableName: 'companies',
    timestamps: true,
    indexes: [
      {
        fields: ['name']
      },
      {
        fields: ['industry']
      }
    ]
  });

  return Company;
};