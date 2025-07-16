// seeders/20250716100000-seed-users.js
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
    // Get all roles from roles table
    const roles = await queryInterface.sequelize.query(
      'SELECT name FROM roles',
      { type: Sequelize.QueryTypes.SELECT }
    );
    // Seed one user per role
    const users = await Promise.all(roles.map(async (role, i) => ({
      full_name: `${role.name.replace(/\s+/g, '_')}_user`,
      cnic: `41234-1234567-${i+1}`,
      email: `${role.name.replace(/\s+/g, '_')}@example.com`,
      mobile: `03${String(i+1).padStart(9, '0')}`,
      password: await bcrypt.hash('password123', 10),
      role: role.name,
      is_active: true,
      photo: null
    })));
    await queryInterface.bulkInsert('users', users, {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
