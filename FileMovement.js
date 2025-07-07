
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const File = require('./File');
const Section = require('./Section');

const FileMovement = sequelize.define('FileMovement', {
  movement_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  file_id: { type: DataTypes.INTEGER, allowNull: false },
  from_section_id: { type: DataTypes.INTEGER },
  to_section_id: { type: DataTypes.INTEGER },
  remarks: { type: DataTypes.TEXT },
  sent_on: { type: DataTypes.DATE },
  received_on: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING(50) }
}, {
  tableName: 'file_movements',
  timestamps: true,
  createdAt: 'last_updated',
  updatedAt: false
});

FileMovement.belongsTo(File, { foreignKey: 'file_id' });
FileMovement.belongsTo(Section, { foreignKey: 'from_section_id', as: 'fromSection' });
FileMovement.belongsTo(Section, { foreignKey: 'to_section_id', as: 'toSection' });

module.exports = FileMovement;
