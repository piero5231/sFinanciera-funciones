import os from "os";
import path from "path";
import ExcelJS, { CellValue } from "exceljs";

export type Resultado = Record<string, string[]>;

const lineasInteres = [
  "OBJETO",
  "DESCRIPCION",
  "ENTIDAD",
  "MONEDA DEL MONTO DEL CONTRATO ORIGINAL",
  "MONTO DEL CONTRATO ORIGINAL",
  "FECHA DE FIRMA DE CONTRATO",
  "FECHA DE INICIO DE LA ORDEN",
  "FECHA PREVISTA DE FIN DE CONTRATO",
  "MIEMBROS CONSORCIO",
  "ESTADO",
];

export async function extraerYProcesarValores(): Promise<Resultado | null> {
  const rutaExcelTemporal: string = path.join(
    os.homedir(),
    "Desktop",
    "contratos.xlsx"
  );
  const result: Resultado = {};
  const workbook = new ExcelJS.Workbook();

  try {
    await workbook.xlsx.readFile(rutaExcelTemporal);
  } catch (err: any) {
    if (err.code === "ENOENT") return null;
    throw err;
  }

  if (workbook.worksheets.length === 0) return null;

  const hojas = ["cotratos", "órdenes"] as const;
  hojas.forEach((nombre) => {
    const hoja = workbook.worksheets.find(
      (ws) => ws.name.toLowerCase() === nombre
    );
    if (!hoja) return;

    hoja.eachRow((fila, rowIndex) => {
      const rawValues: CellValue[] = Array.isArray(fila.values)
        ? fila.values
        : [];

      const valoresFila = rawValues.slice(1).map((v) => (v ?? "").toString());

      lineasInteres.forEach((linea) => {
        const idx = valoresFila.indexOf(linea);
        if (idx === -1) return;

        const key =
          linea === "FECHA DE INICIO DE LA ORDEN" ||
          linea === "FECHA DE FIRMA DE CONTRATO"
            ? "FECHA INICIO"
            : linea;

        if (!result[key]) result[key] = [];

        for (let i = rowIndex + 1; i <= hoja.rowCount; i++) {
          const filaActual = hoja.getRow(i);
          const estaVacia = lineasInteres.every((_, j) => {
            const val = filaActual.getCell(j + 1).value;
            return val === null || String(val).trim() === "";
          });
          if (estaVacia) break;

          const celda = filaActual.getCell(idx + 1).value;
          result[key].push(celda ? String(celda).trim() : "");
        }
      });
    });
  });

  return Object.keys(result).length ? result : null;
}

// if (require.main === module) {
//   (async () => {
//     const datos = await extraerYProcesarValores();
//     console.log("Datos extraídos:", datos);
//   })();
// }
