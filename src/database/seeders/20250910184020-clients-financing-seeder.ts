"use strict";

import { DataTypes, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.bulkInsert("client_financing", [
      // Periodo 2023
      { id: 1, period: "2023", diccionarioId: 70, clientId: 1, value: 1000 },
      { id: 2, period: "2023", diccionarioId: 71, clientId: 1, value: 1100 },
      { id: 3, period: "2023", diccionarioId: 68, clientId: 1, value: 1200 },
      { id: 4, period: "2023", diccionarioId: 60, clientId: 1, value: 1300 },
      { id: 5, period: "2023", diccionarioId: 3, clientId: 1, value: 1400 },
      { id: 6, period: "2023", diccionarioId: 10, clientId: 1, value: 1500 },
      { id: 7, period: "2023", diccionarioId: 56, clientId: 1, value: 1600 },
      { id: 8, period: "2023", diccionarioId: 35, clientId: 1, value: 1700 },
      { id: 9, period: "2023", diccionarioId: 37, clientId: 1, value: 1800 },
      { id: 10, period: "2023", diccionarioId: 43, clientId: 1, value: 1900 },
      { id: 11, period: "2023", diccionarioId: 73, clientId: 1, value: 2000 },
      { id: 12, period: "2023", diccionarioId: 74, clientId: 1, value: 2100 },
      { id: 13, period: "2023", diccionarioId: 75, clientId: 1, value: 2200 },
      { id: 14, period: "2023", diccionarioId: 76, clientId: 1, value: 2300 },

      // Periodo 2024
      { id: 15, period: "2024", diccionarioId: 70, clientId: 1, value: 1050 },
      { id: 16, period: "2024", diccionarioId: 71, clientId: 1, value: 1150 },
      { id: 17, period: "2024", diccionarioId: 68, clientId: 1, value: 1250 },
      { id: 18, period: "2024", diccionarioId: 60, clientId: 1, value: 1350 },
      { id: 19, period: "2024", diccionarioId: 3, clientId: 1, value: 1450 },
      { id: 20, period: "2024", diccionarioId: 10, clientId: 1, value: 1550 },
      { id: 21, period: "2024", diccionarioId: 56, clientId: 1, value: 1650 },
      { id: 22, period: "2024", diccionarioId: 35, clientId: 1, value: 1750 },
      { id: 23, period: "2024", diccionarioId: 37, clientId: 1, value: 1850 },
      { id: 24, period: "2024", diccionarioId: 43, clientId: 1, value: 1950 },
      { id: 25, period: "2024", diccionarioId: 73, clientId: 1, value: 2050 },
      { id: 26, period: "2024", diccionarioId: 74, clientId: 1, value: 2150 },
      { id: 27, period: "2024", diccionarioId: 75, clientId: 1, value: 2250 },
      { id: 28, period: "2024", diccionarioId: 76, clientId: 1, value: 2350 },

      // Periodo 2025
      { id: 29, period: "2025", diccionarioId: 70, clientId: 1, value: 1150 },
      { id: 30, period: "2025", diccionarioId: 71, clientId: 1, value: 1450 },
      { id: 31, period: "2025", diccionarioId: 68, clientId: 1, value: 1522 },
      { id: 32, period: "2025", diccionarioId: 60, clientId: 1, value: 10400 },
      { id: 33, period: "2025", diccionarioId: 3, clientId: 1, value: 1547 },
      { id: 34, period: "2025", diccionarioId: 10, clientId: 1, value: 1600 },
      { id: 35, period: "2025", diccionarioId: 56, clientId: 1, value: 1700 },
      { id: 36, period: "2025", diccionarioId: 35, clientId: 1, value: 1800 },
      { id: 37, period: "2025", diccionarioId: 37, clientId: 1, value: 1911 },
      { id: 38, period: "2025", diccionarioId: 43, clientId: 1, value: 2000 },
      { id: 39, period: "2025", diccionarioId: 73, clientId: 1, value: 2100 },
      { id: 40, period: "2025", diccionarioId: 74, clientId: 1, value: 2200 },
      { id: 41, period: "2025", diccionarioId: 75, clientId: 1, value: 2300 },
      { id: 42, period: "2025", diccionarioId: 76, clientId: 1, value: 2400 },
    ]);
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.bulkDelete("client_financing", {}, {});
  },
};
