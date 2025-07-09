await queryInterface.addColumn('users', 'role_id', {
  type: Sequelize.INTEGER,
  references: {
    model: 'roles',
    key: 'id'
  },
  allowNull: false
});
