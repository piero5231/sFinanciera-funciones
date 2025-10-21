import { Service } from "typedi";
import ClientFinancingRepository from "@/repositories/ClientFinancingRepository";

import { BadRequestError } from "@/utils/ApiError";

type ClientFinancingDTO = {
  diccionarioId: number | string;
  value: number | string | null | undefined;
};

@Service()
export default class FlujoEfectivoService {
  constructor(public clientFinancingRepository: ClientFinancingRepository) {}

  async getRentaData(
    clientId: number,
    period: string
  ): Promise<Record<number, [number, number]>> {
    const prevPeriod = (parseInt(period, 10) - 1).toString();

    const previous = await this.clientFinancingRepository.findByClientRenta({
      clientId,
      period: prevPeriod,
    });

    if (!previous || previous.length === 0) {
      throw new BadRequestError(
        `No se encontró información para el periodo anterior (${prevPeriod})`
      );
    }

    const current = await this.clientFinancingRepository.findByClientRenta({
      clientId,
      period,
    });

    const normalizeNumber = (
      val: number | string | null | undefined
    ): number => {
      if (val === null || val === undefined) return 0;
      if (typeof val === "number") return Number.isFinite(val) ? val : 0;

      let s = String(val).trim();
      if (s === "") return 0;

      const hasDot = s.includes(".");
      const hasComma = s.includes(",");

      if (hasDot && hasComma) {
        if (s.indexOf(".") < s.indexOf(",")) {
          s = s.replace(/\./g, "").replace(/,/g, ".");
        } else {
          s = s.replace(/,/g, "");
        }
      } else if (hasComma && !hasDot) {
        s = s.replace(/,/g, ".");
      }
      const n = parseFloat(s);
      return Number.isFinite(n) ? n : 0;
    };

    const prevMap = new Map<number, number>();
    for (const p of previous as ClientFinancingDTO[]) {
      const id = Number(p.diccionarioId);
      if (Number.isNaN(id)) continue;
      prevMap.set(id, normalizeNumber(p.value));
    }

    const result: Record<number, [number, number]> = {};

    for (const c of current as ClientFinancingDTO[]) {
      const id = Number(c.diccionarioId);
      if (Number.isNaN(id)) continue;

      if (!prevMap.has(id)) continue;

      const prevVal = prevMap.get(id)!;
      const currVal = normalizeNumber(c.value);

      result[id] = [prevVal, currVal];
    }

    return result;
  }

  async calcularFlujoEfectoByRenta(
    clientId: number,
    period: string
  ): Promise<
    Array<{
      diccionarioId: number;
      incremento: number;
      disminusion: number;
      total: number;
    }>
  > {
    const rentaMap = await this.getRentaData(clientId, period);

    const results: Array<{
      diccionarioId: number;
      incremento: number;
      disminusion: number;
      total: number;
    }> = [];

    for (const [idStr, tuple] of Object.entries(rentaMap)) {
      const diccionarioId = Number(idStr);
      if (Number.isNaN(diccionarioId)) continue;

      const [previous = 0, current = 0] = tuple ?? [0, 0];

      const diff = current - previous;

      const incremento = diff > 0 ? diff : 0;

      const disminusion = diff < 0 ? diff : 0;

      const total = incremento + disminusion;

      results.push({ diccionarioId, incremento, disminusion, total });
    }

    return results;
  }


}
