'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'Administrador',
        description: 'Administrador del sistema con acceso total',
        inmutable: true,
        status: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Usuario',
        description: 'Usuario estándar con acceso limitado',
        inmutable: false,
        status: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', { name: ['Admin', 'User'] });
  },
};