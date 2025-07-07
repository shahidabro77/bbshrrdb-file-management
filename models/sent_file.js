module.exports = (sequelize, DataTypes) => {
  return sequelize.define('SentFile', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    file_number: { type: DataTypes.STRING, allowNull: false },
    file_subject: { type: DataTypes.STRING, allowNull: false },
    file_description: { type: DataTypes.TEXT },
    sent_on: { type: DataTypes.DATEONLY, allowNull: false },
    sent_to: { type: DataTypes.STRING, allowNull: false },
    remarks: { type: DataTypes.TEXT },
    reference_number: { type: DataTypes.STRING },
    sent_by: { type: DataTypes.INTEGER },
    attachments: { type: DataTypes.JSON }
  }, {
    tableName: 'sent_files',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
};