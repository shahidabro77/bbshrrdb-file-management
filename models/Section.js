module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Section', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  }, {
    tableName: 'sections',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
};
