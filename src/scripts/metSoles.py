import pdfplumber
import json
import re
import argparse
from typing import Optional, List
import io
import sys
import os

lineasInteres = [
    359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373,
    374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388,
    389, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 414, 415, 416,
    417, 418, 419, 420, 421, 422, 423, 424, 461, 462, 464, 468, 469, 472, 473,
    475, 476, 477, 478, 480, 486, 490,
]

_search_regex = {n: re.compile(rf'(?<!\d){re.escape(str(n))}(?!\d)') for n in lineasInteres}

_reemplazos_especiales = {
    "363": {
        "claveReemplazo": [
            "Cuentas por cobrar al personal, acc\n(socios) y directores",
            "Cuentas por cobrar empleados",
        ],
        "posiciones": 2,
    },
    "406": {
        "claveReemplazo": [
            "Ctas por pagar accionist(soc, partic) y\ndirect",
            "Cuentas por pagar a socios",
        ],
        "posiciones": 2,
    },
    "409": {
        "claveReemplazo": [
            "Obligaciones financieras",
            "Deudas financieras",
        ],
        "posiciones": 2,
    },
}

def normalize_for_match(s: Optional[str]) -> str:
    if s is None:
        return ""
    t = str(s).lower()
    t = t.replace("\n", " ").replace("\r", " ").replace("\t", " ")
    t = re.sub(r'[^a-z0-9\s]', ' ', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def parse_number_from_text(raw: Optional[str]) -> float:
    if raw is None:
        return 0.0
    s = str(raw).strip()
    if s == "" or s == "-" or s == "—":
        return 0.0

    is_paren = s.startswith("(") and s.endswith(")")
    if is_paren:
        s = s[1:-1].strip()

    s = s.replace(" ", "").replace(",", "")

    s = re.sub(r'[^\d\.\-]', '', s)

    if s == "" or s == "-" or s == ".":
        return 0.0

    try:
        val = float(s)
        return -val if is_paren else val
    except Exception:
        return 0.0

def extract_all_tables_from_pdf(path_pdf: str) -> List[List[List[Optional[str]]]]:
    all_tables = []
    with pdfplumber.open(path_pdf) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables() or []
            for t in tables:
                normalized_table = []
                if t is None:
                    continue
                for row in t:
                    normalized_row = [None if c is None else str(c) for c in row]
                    normalized_table.append(normalized_row)
                all_tables.append(normalized_table)
    return all_tables

def extract_all_tables_from_pdf_bytes(pdf_bytes: bytes) -> List[List[List[Optional[str]]]]:
    all_tables = []
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables() or []
            for t in tables:
                normalized_table = []
                if t is None:
                    continue
                for row in t:
                    normalized_row = [None if c is None else str(c) for c in row]
                    normalized_table.append(normalized_row)
                all_tables.append(normalized_table)
    return all_tables
# ------------------------------------------------------------

def extract_values_from_tables(tables: List[List[List[Optional[str]]]], keep_first_only: bool = True) -> dict:
    found = {}
    pendientes = set(lineasInteres)

    for table in tables:
        for row in table:
            if not row:
                continue
            cells = row
            for col_idx, cell_text in enumerate(cells):
                if cell_text is None:
                    continue

                to_check = list(pendientes) if keep_first_only else list(lineasInteres)
                for linea in to_check:
                    regex = _search_regex.get(linea)
                    if regex and regex.search(cell_text):
                        right_idx = col_idx + 1
                        right_value_raw = None
                        if right_idx < len(cells):
                            right_value_raw = cells[right_idx]
                        valor = parse_number_from_text(right_value_raw)
                        key = f"{linea}"
                        if keep_first_only and key in found:
                            pass
                        else:
                            found[key] = valor
                        if keep_first_only:
                            pendientes.discard(linea)
                        if keep_first_only and not pendientes:
                            return found
    return found

def apply_special_replacements_if_missing(tables: List[List[List[Optional[str]]]], found_map: dict) -> dict:

    for key, spec in _reemplazos_especiales.items():
        if key in found_map and found_map[key] is not None:
            continue 
        claves = spec.get("claveReemplazo", [])
        posiciones = int(spec.get("posiciones", 1))
        found_value = None

        claves_norm = [normalize_for_match(k) for k in claves]

        for table in tables:
            if found_value is not None:
                break
            for row in table:
                if found_value is not None:
                    break
                if not row:
                    continue
                cells = row

                for col_idx, cell_text in enumerate(cells):
                    if cell_text is None:
                        continue
                    cell_norm = normalize_for_match(cell_text)

                    matched = False
                    for clave_norm in claves_norm:
                        if clave_norm and clave_norm in cell_norm:
                            matched = True
                            break
                    if matched:

                        target_idx = col_idx + posiciones
                        target_raw = None
                        if target_idx < len(cells):
                            target_raw = cells[target_idx]
               
                        valor = parse_number_from_text(target_raw)
                        found_value = valor
                        break

        if found_value is not None:
            found_map[key] = found_value
     
    return found_map

def build_ordered_result(found_map: dict) -> dict:
    ordered = {}
    for n in lineasInteres:
        key = f"{n}"
        ordered[key] = found_map.get(key) if key in found_map else None
    return ordered

def main():
    parser = argparse.ArgumentParser(description="Extrae valores a la derecha de líneas de interés desde tablas en un PDF (salida ordenada), con reemplazos especiales para 3 claves.")
    
    parser.add_argument("pdf_path", nargs="?", help="Ruta al archivo PDF o '-' para leer desde stdin.")
    parser.add_argument("--output", "-o", help="Archivo JSON de salida (opcional).")
    parser.add_argument("--all", action="store_true", help="Si se especifica, usa la última aparición en vez de la primera.")
    args = parser.parse_args()

    keep_first_only = not args.all

    try:
        if not args.pdf_path or args.pdf_path == "-":
            pdf_bytes = sys.stdin.buffer.read()
            if not pdf_bytes:
                raise ValueError("No se recibieron bytes por stdin.")
            tables = extract_all_tables_from_pdf_bytes(pdf_bytes)
        else:
            pdf_path = args.pdf_path
            if not os.path.exists(pdf_path):
                raise FileNotFoundError(f"Archivo no encontrado: {pdf_path}")
            tables = extract_all_tables_from_pdf(pdf_path)

        found = extract_values_from_tables(tables, keep_first_only=keep_first_only)
        found = apply_special_replacements_if_missing(tables, found)
    except Exception as e:
        sys.stdout.write(json.dumps({"error": str(e)}, ensure_ascii=False))
        sys.exit(1)

    ordered = build_ordered_result(found)
    salida_json = json.dumps(ordered, ensure_ascii=False, indent=2)
    sys.stdout.write(salida_json)

    if args.output:
        try:
            with open(args.output, "w", encoding="utf-8") as f:
                f.write(salida_json)
        except Exception:
            pass

if __name__ == "__main__":
    main()