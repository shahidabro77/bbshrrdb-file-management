'use strict';

module.exports = {
  async up(queryInterface) {
    const roles = [
      'Secretary bbshrrdb',
      'training director',
      'procurment section',
      'admin section',
      'accounts section',
      'training section',
      'public sector',
      'private sector',
      'IT section'
    ];

    const roleData = roles.map(role => ({
      name: role.trim().toLowerCase()
    }));

    await queryInterface.bulkInsert('roles', roleData);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
