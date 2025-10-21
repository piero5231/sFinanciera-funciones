'use strict';

import { DataTypes, literal, QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable('clients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      typeDocument: {
        type: DataTypes.ENUM(...['DNI', 'RUC', 'CE']),
        allowNull: false,
        defaultValue: 'RUC'
      },
      nDocument: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      typeTaxPayer: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      beginActivities: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      inscriptionDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      stateTaxPayer: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      conditionTaxPayer: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: literal('CURRENT_TIMESTAMP'),
      },
      createdBy: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: literal('CURRENT_TIMESTAMP'),
      },
      updatedBy: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.UUID,
      }
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.dropTable('clients');
  },
};
