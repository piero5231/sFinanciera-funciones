'use strict';

import { DataTypes, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.bulkInsert("diccionario_financiero", [
      {
        "id": 1,
        "name": "Efectivo y equivalentes de efectivo",
        "code": "359",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 2,
        "name": "Inversiones financieras",
        "code": "360",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 3,
        "name": "Ctas por cobrar comerciales - terco",
        "code": "361",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 4,
        "name": "Ctas por cobrar comerciales - real",
        "code": "362",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 5,
        "name": "Cuentas por cobrar al personal, acá (socios) y directores",
        "code": "363",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 6,
        "name": "Ctas por cobrar diversas - terceros",
        "code": "364",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 7,
        "name": "Ctas por cobrar diversas - relacionados",
        "code": "365",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 8,
        "name": "Serv y otros contratados por anticipados",
        "code": "366",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 9,
        "name": "Estimación ctas de cobranza dudosa",
        "code": "367",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 10,
        "name": "Mercaderías",
        "code": "368",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 11,
        "name": "Productos terminados",
        "code": "369",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 12,
        "name": "Subproductos, desechos y desperdicios",
        "code": "370",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 13,
        "name": "Productos en proceso",
        "code": "371",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 14,
        "name": "Materias primas",
        "code": "372",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 15,
        "name": "Materiales aux, suministros y repuestos",
        "code": "373",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 16,
        "name": "Envases y embalajes",
        "code": "374",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 17,
        "name": "Inventarios por recibir",
        "code": "375",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 18,
        "name": "Desvalorización de inventarios",
        "code": "376",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 19,
        "name": "Activos no ctas mantenidos para la vía",
        "code": "377",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 20,
        "name": "Otros activos corrientes",
        "code": "378",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 21,
        "name": "Inversiones mobiliarias",
        "code": "379",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 22,
        "name": "Propiedades de inversión (1)",
        "code": "380",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 23,
        "name": "Activos por derecho de uso (2)",
        "code": "381",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 24,
        "name": "Propiedades, planta y equipo",
        "code": "382",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 25,
        "name": "Depreciación de 1, 2 y PPE acumulados",
        "code": "383",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 26,
        "name": "Intangibles",
        "code": "384",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 27,
        "name": "Activos biológicos",
        "code": "385",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 28,
        "name": "Deprec act biológico y amortize acumulado",
        "code": "386",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 29,
        "name": "Desvalorización de activo inmovilizado",
        "code": "387",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 30,
        "name": "Activo diferido",
        "code": "388",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 31,
        "name": "Otros activos no corrientes",
        "code": "389",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 32,
        "name": "Total activo neto",
        "code": "390",
        "category": "Activo",
        "group": "Balance General"
      },
      {
        "id": 33,
        "name": "Sobregiros bancarios ",
        "code": "401",
        "category": "Pasivo",
        "group": "Balance General"
      },
      {
        "id": 34,
        "name": "Trib y aport sist pens y salud por pagar",
        "code": "402",
        "category": "Pasivo",
        "group": "Balance General"
      },
      {
        "id": 35,
        "name": "Remuneraciones y particip por pagar",
        "code": "403",
        "category": "Pasivo",
        "group": "Balance General"
      },
      {
        "id": 36,
        "name": "Ctas por pagar comerciales - terceros",
        "code": "404",
        "category": "Pasivo",
        "group": "Balance General"
      },
      {
        "id": 37,
        "name": "Ctas por pagar comerciales -relac",
        "code": "405",
        "category": "Pasivo",
        "group": "Balance General"
      },
      {
        "id": 38,
        "name": "Ctas por pagar accionist(soc, partic) y direct",
        "code": "406",
        "category": "Pasivo",
        "group": "Balance General"
      },
      {
        "id": 39,
        "name": "Ctas por pagar diversas - terceros",
        "code": "407",
        "category": "Pasivo",
        "group": "Balance General"
      },
      {
        "id": 40,
        "name": "Ctas por pagar diversas - relacionadas",
        "code": "408",
        "category": "Pasivo",
        "group": "Balance General"
      },
      {
        "id": 41,
        "name": "Obligaciones financieras",
        "code": "409",
        "category": "Pasivo",
        "group": "Balance General"
      },
      {
        "id": 42,
        "name": "Provisiones",
        "code": "410",
        "category": "Pasivo",
        "group": "Balance General"
      },
      {
        "id": 43,
        "name": "Pasivo diferido",
        "code": "411",
        "category": "Pasivo",
        "group": "Balance General"
      },
      {
        "id": 44,
        "name": "Total pasivo",
        "code": "412",
        "category": "Pasivo",
        "group": "Balance General"
      },
      {
        "id": 45,
        "name": "Capital",
        "code": "414",
        "category": "Patrimonio",
        "group": "Balance General"
      },
      {
        "id": 46,
        "name": "Acciones de inversión",
        "code": "415",
        "category": "Patrimonio",
        "group": "Balance General"
      },
      {
        "id": 47,
        "name": "Capital adicional positivo",
        "code": "416",
        "category": "Patrimonio",
        "group": "Balance General"
      },
      {
        "id": 48,
        "name": "Capital adicional negativo",
        "code": "417",
        "category": "Patrimonio",
        "group": "Balance General"
      },
      {
        "id": 49,
        "name": "Resultados no realizados",
        "code": "418",
        "category": "Patrimonio",
        "group": "Balance General"
      },
      {
        "id": 50,
        "name": "Excedente de revaluación",
        "code": "419",
        "category": "Patrimonio",
        "group": "Balance General"
      },
      {
        "id": 51,
        "name": "Reservas",
        "code": "420",
        "category": "Patrimonio",
        "group": "Balance General"
      },
      {
        "id": 52,
        "name": "Resultados acumulados positivos",
        "code": "421",
        "category": "Patrimonio",
        "group": "Balance General"
      },
      {
        "id": 53,
        "name": "Resultados acumulados negativos",
        "code": "422",
        "category": "Patrimonio",
        "group": "Balance General"
      },
      {
        "id": 54,
        "name": "Utilidad de ejercicio",
        "code": "423",
        "category": "Patrimonio",
        "group": "Balance General"
      },
      {
        "id": 55,
        "name": "Pérdida de ejercicio",
        "code": "424",
        "category": "Patrimonio",
        "group": "Balance General"
      },
      {
        "id": 56,
        "name": "Total patrimonio",
        "code": "425",
        "category": "Patrimonio",
        "group": "Balance General"
      },
      {
        "id": 57,
        "name": "Total pasivo y patrimonio",
        "code": "426",
        "category": "Patrimonio",
        "group": "Balance General"
      },
      {
        "id": 58,
        "name": "Ventas netas o ing por servicios",
        "code": "461",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 59,
        "name": "Desc, rebajas y bonif concedidas",
        "code": "462",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 60,
        "name": "Ventas netas",
        "code": "463",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 61,
        "name": "Costo de ventas",
        "code": "464",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 62,
        "name": "Resultado bruto utilidad",
        "code": "466",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 63,
        "name": "Resultado bruto pérdida",
        "code": "467",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 64,
        "name": "Gastos de ventas",
        "code": "468",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 65,
        "name": "Gastos de administración",
        "code": "469",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 66,
        "name": "Resultado de operación utilidad",
        "code": "470",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 67,
        "name": "Resultado de operación pérdida",
        "code": "471",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 68,
        "name": "Gastos financieros",
        "code": "472",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 69,
        "name": "Ingresos financieros gravados",
        "code": "473",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 70,
        "name": "Otros ingresos gravados",
        "code": "475",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 71,
        "name": "Otros ingresos no gravados",
        "code": "476",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 72,
        "name": "Enajen. De val. Y bienes del Act. F.",
        "code": "477",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 73,
        "name": "Costo encajen, de val. Y bienes A.F",
        "code": "478",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 74,
        "name": "Gastos diversos",
        "code": "480",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 75,
        "name": "REI del ejercicio positivo",
        "code": "481",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 76,
        "name": "REI del ejercicio negativo",
        "code": "483",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 77,
        "name": "Resultado antes de part - utilidad",
        "code": "484",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 78,
        "name": "Resultado antes de part - pérdida",
        "code": "485",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 79,
        "name": "Distribución legal de la renta",
        "code": "486",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 80,
        "name": "Resultado antes del imp - utilidad",
        "code": "487",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 81,
        "name": "Resultado antes del imp - pérdida",
        "code": "489",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 82,
        "name": "Impuesto a la renta",
        "code": "490",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 83,
        "name": "Resultado del ejercicio - utilidad",
        "code": "492",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 84,
        "name": "Resultado del ejercicio - pérdida",
        "code": "493",
        "category": null,
        "group": "Estado de Resultados"
      },
      {
        "id": 85,
        "name": "Enero. ",
        "code": null,
        "category": "Ventas",
        "group": "Ventas Unificadas"
      },
      {
        "id": 86,
        "name": "Febrero.",
        "code": null,
        "category": "Ventas",
        "group": "Ventas Unificadas"
      },
      {
        "id": 87,
        "name": "Marzo.",
        "code": null,
        "category": "Ventas",
        "group": "Ventas Unificadas"
      },
      {
        "id": 88,
        "name": "Abril.",
        "code": null,
        "category": "Ventas",
        "group": "Ventas Unificadas"
      },
      {
        "id": 89,
        "name": "Mayo.",
        "code": null,
        "category": "Ventas",
        "group": "Ventas Unificadas"
      },
      {
        "id": 90,
        "name": "Junio.",
        "code": null,
        "category": "Ventas",
        "group": "Ventas Unificadas"
      },
      {
        "id": 91,
        "name": "Julio.",
        "code": null,
        "category": "Ventas",
        "group": "Ventas Unificadas"
      },
      {
        "id": 92,
        "name": "Agosto.",
        "code": null,
        "category": "Ventas",
        "group": "Ventas Unificadas"
      },
      {
        "id": 93,
        "name": "Setiembre.",
        "code": null,
        "category": "Ventas",
        "group": "Ventas Unificadas"
      },
      {
        "id": 94,
        "name": "Octubre.",
        "code": null,
        "category": "Ventas",
        "group": "Ventas Unificadas"
      },
      {
        "id": 95,
        "name": "Noviembre.",
        "code": null,
        "category": "Ventas",
        "group": "Ventas Unificadas"
      },
      {
        "id": 96,
        "name": "Diciembre.",
        "code": null,
        "category": "Ventas",
        "group": "Ventas Unificadas"
      },
      {
        "id": 97,
        "name": "Ingresos netos del periodo",
        "code": null,
        "category": null,
        "group": "Informacion economico"
      },
      {
        "id": 98,
        "name": "Otro ingresos declarados",
        "code": null,
        "category": null,
        "group": "Informacion economico"
      },
      {
        "id": 99,
        "name": "Total activos netos",
        "code": null,
        "category": null,
        "group": "Informacion economico"
      },
      {
        "id": 100,
        "name": "Cxc - terceros",
        "code": null,
        "category": null,
        "group": "Informacion economico"
      },
      {
        "id": 101,
        "name": "Cxc - relacionados",
        "code": null,
        "category": null,
        "group": "Informacion economico"
      },
      {
        "id": 102,
        "name": "Cxc - diversas - terceros",
        "code": null,
        "category": null,
        "group": "Informacion economico"
      },
      {
        "id": 103,
        "name": "Cxc - accionistas, socios, directores",
        "code": null,
        "category": null,
        "group": "Informacion economico"
      },
      {
        "id": 104,
        "name": "Provisión cxc - dudosa",
        "code": null,
        "category": null,
        "group": "Informacion economico"
      },
      {
        "id": 105,
        "name": "Cxp (proveedores / terceros / relacionados)",
        "code": null,
        "category": null,
        "group": "Informacion economico"
      },
      {
        "id": 106,
        "name": "Total pasivo",
        "code": null,
        "category": null,
        "group": "Informacion economico"
      },
      {
        "id": 107,
        "name": "Total patrimonio",
        "code": null,
        "category": null,
        "group": "Informacion economico"
      },
      {
        "id": 108,
        "name": "Capital social",
        "code": null,
        "category": null,
        "group": "Informacion economico"
      },
      {
        "id": 109,
        "name": "Resultado bruto (Utilidad o pérdida)",
        "code": null,
        "category": null,
        "group": "Informacion economico"
      },
      {
        "id": 110,
        "name": "Resultado antes particip. e impu.",
        "code": null,
        "category": null,
        "group": "Informacion economico"
      },
      {
        "id": 111,
        "name": "Importe pagado",
        "code": null,
        "category": null,
        "group": "Informacion economico"
      },
      {
        "id": 112,
        "name": "Deuda directa SBS",
        "code": null,
        "category": null,
        "group": "Deuda historica"
      },
      {
        "id": 113,
        "name": "Deuda indirecta SBS",
        "code": null,
        "category": null,
        "group": "Deuda historica"
      },
      {
        "id": 114,
        "name": "Deuda adic. Identificada",
        "code": null,
        "category": null,
        "group": "Deuda historica"
      }
    ]);
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.bulkDelete("diccionario_financiero", {}, {});
  },
};
