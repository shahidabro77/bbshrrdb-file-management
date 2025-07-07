// models/FileLog.js

module.exports = (sequelize, DataTypes) => {
  const FileLog = sequelize.define("FileLog", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    file_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    source: {
      type: DataTypes.ENUM('sent', 'received'),
      allowNull: false,
    },
    section: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'file_logs',
    timestamps: false,
  });

  return FileLog;
};
