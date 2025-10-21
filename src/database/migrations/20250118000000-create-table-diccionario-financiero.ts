'use strict';

import { DataTypes, literal, QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable('diccionario_financiero', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      code: {
        allowNull: true,
        type: DataTypes.STRING(100)
      },
      category: {
        allowNull: true,
        type: DataTypes.STRING(150)
      },
      group: {
        allowNull: false,
        type: DataTypes.STRING(255)
      }
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.dropTable('diccionario_financiero');
  },
};
