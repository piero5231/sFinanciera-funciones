"use strict";

import { DataTypes, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.bulkInsert("ratio_financiero", [
      {
        id: 1,
        name: "Razon Corriente",
        tipoRatioId: 1,
        formula:
          "TOTAL_PASIVO_CIRC == 0 ? 0 : TOTAL_ACTIVO_CIRC /TOTAL_PASIVO_CIRC",
      },
      {
        id: 2,
        name: "Perm de CxC",
        tipoRatioId: 2,
        formula:
          "VENTAS_NETAS == 0 ? 0 : CTAS_X_COBRAR_COMER_TERC * 360 / VENTAS_NETAS",
      },
      {
        id: 3,
        name: "Rotacion de Inventarios",
        tipoRatioId: 2,
        formula:
          "MERCADERIAS == 0 ? 0 : COSTO_DE_VENTAS / MERCADERIAS",
      },
       {
        id: 4,
        name: "Perm de CxPagar",
        tipoRatioId: 2,
        formula:
          "COSTO_DE_VENTAS == 0 ? 0 : (CTAS_POR_PAGAR_COMERC_TERCEROS_TPCIRC + CTAS_POR_PAGAR_COMERC_TERCEROS_TPNCIRC) * 360 / COSTO_DE_VENTAS * (0.18 + 1)",
      },
       {
        id: 5,
        name: "Deuda Total/Venta Total",
        tipoRatioId: 3,
        formula:
          "VENTAS_NETAS == 0 ? 0 : (TOTAL_PASIVO_CIRC + TOTAL_PASIVO_NO_CIRC - CTAS_POR_PAGAR_ACC_DIREC_GER_TPCIRC - CTAS_POR_PAGAR_ACC_DIREC_GER_TPNCIRC) / VENTAS_NETAS",
      },
       {  
        id: 6,
        name: "Autonomía Financiera (Capital Soc./Pas.)",
        tipoRatioId: 3,
        formula:
          "(TOTAL_PASIVO_NO_CIRC + TOTAL_PASIVO_CIRC) == 0 ? 0 : CAPITAL / (TOTAL_PASIVO_NO_CIRC + TOTAL_PASIVO_CIRC - CTAS_POR_PAGAR_ACC_DIREC_GER_TPCIRC - CTAS_POR_PAGAR_ACC_DIREC_GER_TPNCIRC)",
      },
       {
        id: 7,
        name: "Endeudamiento del Activo",
        tipoRatioId: 3,
        formula:
          "TOTAL_ACTIVOS == 0 ? 0 : (TOTAL_PASIVO_CIRC + TOTAL_PASIVO_NO_CIRC) / TOTAL_ACTIVOS",
      },
      {
        id: 8,
        name: "Margen Operacional (Utilidad Oper. / Ventas)",
        tipoRatioId: 3,
        formula:
          "VENTAS_NETAS == 0 ? 0 : RESULTADO_DE_OPERACION / VENTAS_NETAS",
      },
      {
        id: 9,
        name: "Margen Neto (Utilidad Neta / Ventas)",
        tipoRatioId: 3,
        formula:
          "VENTAS_NETAS == 0 ? 0 : UTILIDAD_NETA / VENTAS_NETAS",
      },
      {
        id: 10,
        name: "ROA (Ut. Neta / Activos)",
        tipoRatioId: 3,
        formula:
          "TOTAL_ACTIVOS == 0 ? 0 : UTILIDAD_NETA / TOTAL_ACTIVOS",
      },
      {
        id: 11,
        name: "ROE (Ut. Neta / Pat.)",
        tipoRatioId: 3,
        formula:
          "TOTAL_PATRIMONIO == 0 ? 0 : UTILIDAD_NETA / TOTAL_PATRIMONIO",
      },
    ]);
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.bulkDelete("ratio_financiero", {}, {});
  },
};
