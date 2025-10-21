"use strict";
import { DataTypes, QueryInterface, literal } from "sequelize";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable("detalle_ratio", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      period: {
        allowNull: false,
        type: Sequelize.CHAR(4),
      },
      clientId: {
        allowNull: false,
        type: DataTypes.BIGINT,
        references: {
          key: "id",
          model: "clients",
        },
        onUpdate: "RESTRICT",
        onDelete: "RESTRICT",
      },
      ratioFinancieroId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "ratio_financiero",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      resultado: {
        allowNull: false,
        type: DataTypes.DECIMAL(10, 2),
      },
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.dropTable("detalle_ratio");
  },
};
