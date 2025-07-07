
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Section = sequelize.define('Section', {
  section_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  section_name: { type: DataTypes.STRING(100), unique: true, allowNull: false }
}, {
  tableName: 'sections',
  timestamps: false
});

module.exports = Section;
