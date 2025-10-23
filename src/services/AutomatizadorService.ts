import os from "os";
import path from "path";
import ExcelJS, { CellValue } from "exceljs";

export type Resultado = Record<string, string>[];

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
  const result: Resultado = [];
  const workbook = new ExcelJS.Workbook();

  try {
    await workbook.xlsx.readFile(rutaExcelTemporal);
  } catch (err: any) {
    if (err.code === "ENOENT") return null;
    throw err;
  }

  if (workbook.worksheets.length === 0) return null;

  const hojas = ["cotratos", "órdenes"] as const;

  for (const nombreHoja of hojas) {
    // buscamos la hoja en el workbook (comparación en minúsculas)
    const ws = workbook.worksheets.find(
      (w) => w.name && w.name.toLowerCase() === nombreHoja
    );
    if (!ws) continue;

    // 1) detectar la fila de encabezados (la que contiene al menos una lineaInteres)
    let headerRowIndex = -1;
    for (let r = 1; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      const vals =
        Array.isArray(row.values) ? row.values.slice(1).map((v) => String(v ?? "").trim()) : [];
      if (lineasInteres.some((li) => vals.includes(li))) {
        headerRowIndex = r;
        break;
      }
    }
    if (headerRowIndex === -1) continue; // no encontramos encabezados en esta hoja

    // 2) construir un mapa header -> columna (índice 1-based)
    const headerRow = ws.getRow(headerRowIndex);
    const headerVals =
      Array.isArray(headerRow.values) ? headerRow.values.slice(1).map((v) => String(v ?? "").trim()) : [];
    const headerMap = new Map<string, number>();
    headerVals.forEach((h, i) => {
      if (!h) return;
      if (lineasInteres.includes(h)) {
        const key =
          h === "FECHA DE INICIO DE LA ORDEN" || h === "FECHA DE FIRMA DE CONTRATO"
            ? "FECHA INICIO"
            : h;
        headerMap.set(key, i + 1); // i+1 porque slice(1) y queremos columna 1-based
      }
    });

    if (headerMap.size === 0) continue;

    // 3) iterar las filas de datos (desde headerRowIndex + 1)
    for (let r = headerRowIndex + 1; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      const filaObj: Record<string, string> = {};
      let filaVacia = true;

      for (const [key, colIdx] of headerMap) {
        const celda = row.getCell(colIdx).value;
        const valor = celda ? String(celda).trim() : "";
        filaObj[key] = valor;
        if (valor !== "") filaVacia = false;
      }

      if (!filaVacia) result.push(filaObj);
    }
  }

  return result.length ? result : null;
}

