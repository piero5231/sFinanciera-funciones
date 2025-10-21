'use strict';

import { DataTypes, literal, QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable('client_financing', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      period: {
        allowNull: false,
        type: Sequelize.CHAR(4),
      },
      diccionarioId: {
        allowNull: false,
        type: DataTypes.BIGINT,
        references: {
          key: "id",
          model: "diccionario_financiero"
        },
        onUpdate: "RESTRICT",
        onDelete: "RESTRICT"
      },
      clientId: {
        allowNull: false,
        type: DataTypes.BIGINT,
        references: {
          key: "id",
          model: "clients"
        },
        onUpdate: "RESTRICT",
        onDelete: "RESTRICT"
      },
      value: {
        allowNull: false,
        type: DataTypes.DECIMAL(10, 2)
      }
    }, {
      uniqueKeys: {
        unique_client_financing: {
          fields: ["period", "diccionarioId", "clientId"]
        }
      }
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.dropTable('client_financing');
  },
};
