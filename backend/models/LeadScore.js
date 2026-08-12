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
    lastCalculated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    factors: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'JSON object containing scoring factors and their values'
    }
  }, {
    sequelize,
    modelName: 'LeadScore',
    tableName: 'leadscores',
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
        fields: ['lastCalculated']
      }
    ]
  });

  return LeadScore;
};