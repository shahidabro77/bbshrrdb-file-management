
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const File = require('./File');

const FileAttachment = sequelize.define('FileAttachment', {
  attachment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  file_id: { type: DataTypes.INTEGER, allowNull: false },
  file_path: { type: DataTypes.TEXT, allowNull: false }
}, {
  tableName: 'file_attachments',
  timestamps: true,
  createdAt: 'uploaded_at',
  updatedAt: false
});

FileAttachment.belongsTo(File, { foreignKey: 'file_id' });

module.exports = FileAttachment;
