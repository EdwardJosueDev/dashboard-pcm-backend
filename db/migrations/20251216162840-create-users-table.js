'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        comment: 'Identificador único del usuario',
      },
      full_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Nombre completo del usuario',
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Correo electrónico único del usuario',
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: 'Teléfono del usuario',
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Contraseña hasheada (bcrypt)',
      },
      entity_id: {
        type: Sequelize.BIGINT,
        allowNull: true, // NULL para administradores sin entidad
        comment: 'Entidad a la que pertenece el usuario (NULL para super admins)',
      },
      role_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        comment: 'Rol asignado al usuario',
      },

      // Auditoría
      created_by: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      updated_by: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      deleted_by: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Constraints nombrados
    await queryInterface.addConstraint('users', {
      fields: ['email'],
      type: 'unique',
      name: 'uq_users_email',
    });

    await queryInterface.addConstraint('users', {
      fields: ['entity_id'],
      type: 'foreign key',
      name: 'fk_users_entity_id_entities',
      references: {
        table: 'entities',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addConstraint('users', {
      fields: ['role_id'],
      type: 'foreign key',
      name: 'fk_users_role_id_roles',
      references: {
        table: 'roles',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    // Self-referencing audit fields
    await queryInterface.addConstraint('users', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'fk_users_created_by_users',
      references: { table: 'users', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addConstraint('users', {
      fields: ['updated_by'],
      type: 'foreign key',
      name: 'fk_users_updated_by_users',
      references: { table: 'users', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addConstraint('users', {
      fields: ['deleted_by'],
      type: 'foreign key',
      name: 'fk_users_deleted_by_users',
      references: { table: 'users', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};