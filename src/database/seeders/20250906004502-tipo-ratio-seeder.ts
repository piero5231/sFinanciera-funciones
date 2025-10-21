'use strict';

import { DataTypes, QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.bulkInsert('tipo_ratio', [
      {
        id: 1,
        name: 'Liquidez',
      },
      {
        id: 2,
        name: 'Gestion',
      },
      {
        id: 3,
        name: 'Solvencia',
      },
      {
        id: 4,
        name: 'Rentabilidad',
      },
      {
        id: 5,
        name: 'Productividad de Activos',
      },
    ]);
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.bulkDelete('tipo_ratio', {}, {});
  },
};
