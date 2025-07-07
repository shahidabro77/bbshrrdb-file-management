
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const File = sequelize.define('File', {
  file_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  file_number: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  subject: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT },
  created_by: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'files',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

File.belongsTo(User, { foreignKey: 'created_by' });

module.exports = File;
