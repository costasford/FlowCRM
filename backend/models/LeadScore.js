'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LeadScore extends Model {
    static associate(models) {
      LeadScore.belongsTo(models.Contact, {
        foreignKey: 'contactId',
        as: 'contact'
      });
    }
  }

  LeadScore.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    contactId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'contacts',
        key: 'id'
      }
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    lastUpdated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    factors: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'JSON object containing scoring factors and their values'
    },
    engagementScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    demographicScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    behaviorScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    grade: {
      type: DataTypes.ENUM('A', 'B', 'C', 'D', 'F'),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'LeadScore',
    tableName: 'lead_scores',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['contactId']
      },
      {
        fields: ['score']
      },
      {
        fields: ['grade']
      },
      {
        fields: ['lastUpdated']
      }
    ]
  });

  return LeadScore;
};