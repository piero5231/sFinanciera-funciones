'use strict';

import { create } from 'domain';
import { DataTypes, QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.bulkInsert('clients', [
      {
        id: 1,
        typeDocument: 'RUC',
        nDocument: '20523456789',
        typeTaxPayer: 'Persona Jurídica',
        name:"Pedro Suarez",
        beginActivities: '2020-01-01',
        inscriptionDate: '2020-01-01',
        stateTaxPayer: 'Activo',
        conditionTaxPayer: 'Habido',
        address: 'Av. Siempre Viva 123, Lima, Perú',
        createdAt: new Date(),
        createdBy: '0dcb07ca-3da3-4212-bd7f-594dbaae7c3a',
        updatedAt: new Date(),
      },
      {
        id: 2,
        typeDocument: 'DNI',
        nDocument: '20523456666',
        typeTaxPayer: 'Persona Natural',
        name:"Maria Alejandra",
        beginActivities: '2025-11-10',
        inscriptionDate: '2024-12-20',
        stateTaxPayer: 'Activo',
        conditionTaxPayer: 'Habido',
        address: 'Av. Siempre Viva 456, Lima, Perú',
        createdAt: new Date(),
        createdBy: '0dcb07ca-3da3-4212-bd7f-594dbaae7c3a',
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.bulkDelete('clients', {}, {});
  },
};
