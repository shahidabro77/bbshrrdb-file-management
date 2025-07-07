module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ReceivedFile', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      file_number: { type: DataTypes.STRING, allowNull: false },
      file_subject: { type: DataTypes.STRING, allowNull: false },
      file_description: { type: DataTypes.TEXT },
      received_on: { type: DataTypes.DATEONLY, allowNull: false },
      received_from: { type: DataTypes.STRING, allowNull: false },
      sent_to: { type: DataTypes.STRING, allowNull: false },
      sent_on: { type: DataTypes.DATEONLY, allowNull: false },
      remarks: { type: DataTypes.TEXT },
      attachments: { type: DataTypes.JSON },
      created_by: { type: DataTypes.INTEGER }
    }, {
      tableName: 'received_files',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    });
  };