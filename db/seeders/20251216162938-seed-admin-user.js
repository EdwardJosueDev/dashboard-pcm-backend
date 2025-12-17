'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('12345678', 12);

    const [adminRole] = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name = 'Administrador'"
    );

    await queryInterface.bulkInsert('users', [
      {
        full_name: 'Administrador Principal',
        email: 'admin@mail.com',
        phone: null,
        password: hashedPassword,
        entity_id: null, // Sin entidad
        role_id: adminRole[0].id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'admin@mail.com' });
  },
};