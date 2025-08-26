import pdfplumber
import json
import re
import argparse
from typing import Optional, List, Dict, Tuple
import io
import sys
import os

TARGET_TITLE = "INFORMACIÓN DE VENTAS, INGRESOS DE RENTA, Y CONTRIBUCIONES A ESSALUD (MENSUAL EJERCICIOS ANTERIORES Y CORRIENTE)"

MONTHS_CANONICAL = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
]

MONTH_MATCH_ALIASES = {
    "ENERO": ["enero"],
    "FEBRERO": ["febrero"],
    "MARZO": ["marzo"],
    "ABRIL": ["abril"],
    "MAYO": ["mayo"],
    "JUNIO": ["junio"],
    "JULIO": ["julio"],
    "AGOSTO": ["agosto"],
    "SEPTIEMBRE": ["septiembre", "setiembre"],
    "OCTUBRE": ["octubre"],
    "NOVIEMBRE": ["noviembre"],
    "DICIEMBRE": ["diciembre"],
}

def normalize_for_match(s: Optional[str]) -> str:
    if s is None:
        return ""
    t = str(s).lower()
    t = t.replace("\n", " ").replace("\r", " ").replace("\t", " ")
    t = re.sub(r'[^a-z0-9\s]', ' ', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def extract_pages_tables_from_pdf(path_pdf: str) -> List[Tuple[int, str, List[List[List[Optional[str]]]]]]:
    pages = []
    with pdfplumber.open(path_pdf) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text() or ""
            tables_raw = page.extract_tables() or []
            tables = []
            for t in tables_raw:
                if t is None:
                    continue
                norm_table = []
                for row in t:
                    norm_row = [None if c is None else str(c) for c in row]
                    norm_table.append(norm_row)
                tables.append(norm_table)
            pages.append((i + 1, text, tables))
    return pages

def extract_pages_tables_from_pdf_bytes(pdf_bytes: bytes) -> List[Tuple[int, str, List[List[List[Optional[str]]]]]]:
    pages = []
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text() or ""
            tables_raw = page.extract_tables() or []
            tables = []
            for t in tables_raw:
                if t is None:
                    continue
                norm_table = []
                for row in t:
                    norm_row = [None if c is None else str(c) for c in row]
                    norm_table.append(norm_row)
                tables.append(norm_table)
            pages.append((i + 1, text, tables))
    return pages

def find_target_page(pages: List[Tuple[int, str, List[List[List[Optional[str]]]]]], target_title: str):
    target_norm = normalize_for_match(target_title)
    for page_no, page_text, tables in pages:
        if target_norm and target_norm in normalize_for_match(page_text):
            return page_no, page_text, tables
    # fallback por tokens (si no hay coincidencia exacta)
    target_tokens = set(target_norm.split())
    for page_no, page_text, tables in pages:
        page_norm = normalize_for_match(page_text)
        page_tokens = set(page_norm.split())
        if len(target_tokens & page_tokens) >= max(6, int(len(target_tokens) * 0.5)):
            return page_no, page_text, tables
    raise FileNotFoundError(f"No se encontró la página con el título objetivo: {target_title}")

def is_empty_cell(cell: Optional[str]) -> bool:
    if cell is None:
        return True
    txt = str(cell).strip()
    return txt == "" or txt == "-" or txt == "—"

def extract_right_cell_value(table: List[List[Optional[str]]], row_idx: int, col_idx: int) -> str:
    """Extrae estrictamente la celda col_idx + 1; si no existe o está vacía devuelve ''."""
    if row_idx < 0 or row_idx >= len(table):
        return ""
    row = table[row_idx]
    target_idx = col_idx + 1
    if 0 <= target_idx < len(row):
        val = row[target_idx]
        if is_empty_cell(val):
            return ""
        return str(val).strip()
    return ""

def extract_values_right_of_months(tables: List[List[List[Optional[str]]]]) -> Dict[str, List[str]]:
    """
    Recorre todas las tablas de la página objetivo. Para cada celda que coincida con un mes (alias),
    extrae la celda inmediata a la derecha (col+1). Cada aparición genera un elemento en la lista del mes.
    Si la celda derecha no existe o está vacía, se añade "".
    """
    out = {m: [] for m in MONTHS_CANONICAL}
    month_aliases_norm = {m: [normalize_for_match(a) for a in alias_list] for m, alias_list in MONTH_MATCH_ALIASES.items()}

    for table in tables:
        for r_idx, row in enumerate(table):
            if not row:
                continue
            for c_idx, cell in enumerate(row):
                if cell is None:
                    continue
                cell_norm = normalize_for_match(cell)
                if not cell_norm:
                    continue
                # comparar con cada mes
                for mes_canon, aliases in month_aliases_norm.items():
                    matched = False
                    for alias in aliases:
                        # coincidencia si la celda contiene exactamente el alias o lo contiene como token
                        if alias and (alias == cell_norm or f" {alias} " in f" {cell_norm} " or cell_norm.startswith(alias + " ") or cell_norm.endswith(" " + alias)):
                            matched = True
                            break
                    if matched:
                        val = extract_right_cell_value(table, r_idx, c_idx)
                        out[mes_canon].append(val)
                        # continuar buscando otras apariciones (no limitamos por tabla ni por fila)
                        break

    return out

def main():
    parser = argparse.ArgumentParser(description="Extrae, por cada aparición de los meses en las tablas de la página objetivo, la celda inmediatamente a su derecha (si no existe o está vacía devuelve '').")
    parser.add_argument("pdf_path", nargs="?", help="Ruta al archivo PDF o '-' para leer desde stdin.")
    parser.add_argument("--output", "-o", help="Archivo JSON de salida (opcional).")
    args = parser.parse_args()

    try:
        if not args.pdf_path or args.pdf_path == "-":
            pdf_bytes = sys.stdin.buffer.read()
            if not pdf_bytes:
                raise ValueError("No se recibieron bytes por stdin.")
            pages = extract_pages_tables_from_pdf_bytes(pdf_bytes)
        else:
            pdf_path = args.pdf_path
            if not os.path.exists(pdf_path):
                raise FileNotFoundError(f"Archivo no encontrado: {pdf_path}")
            pages = extract_pages_tables_from_pdf(pdf_path)

        page_no, page_text, tables = find_target_page(pages, TARGET_TITLE)

        final = extract_values_right_of_months(tables)

    except Exception as e:
        sys.stdout.write(json.dumps({"error": str(e)}, ensure_ascii=False))
        sys.exit(1)

    salida_json = json.dumps(final, ensure_ascii=False, indent=2)
    sys.stdout.write(salida_json)

    if args.output:
        try:
            with open(args.output, "w", encoding="utf-8") as f:
                f.write(salida_json)
        except Exception:
            pass

if __name__ == "__main__":
    main()




