"use strict";
import { DataTypes, QueryInterface, literal } from "sequelize";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable("ratio_financiero", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(250),
      },
      tipoRatioId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "tipo_ratio",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      formula: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.dropTable("ratio_financiero");
  },
};
