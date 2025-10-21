import { Service } from "typedi";
import { BadRequestError, NotFoundObjectError } from "@/utils/ApiError";
import RatioFinancieroRepository from "@/repositories/RatioFinancieroRepository";
import ClientFinancingRepository from "@/repositories/ClientFinancingRepository";
import { DetalleRatioRequest } from "@/request/CreateDetalleRatio";
import DetalleRatioRepository from "@/repositories/DetalleRatioRepository";
@Service()
export default class RatioFinancieroService {
  constructor(
    public clientFinancingRepository: ClientFinancingRepository,
    public ratioFinanciero: RatioFinancieroRepository,
    public detalleRatioRepository: DetalleRatioRepository
  ) {}

  async transformDataScope({
    clientId,
    period,
  }: {
    clientId: number;
    period: string;
  }) {
    const rentas = await this.clientFinancingRepository.findByClientRenta({
      clientId,
      period,
    });

    if (!rentas) {
      throw new NotFoundObjectError(
        "No se Datos de renta para el cliente y periodo"
      );
    }

    return rentas.reduce((acc, renta) => {
      acc[renta.diccionarioId] = Number(renta.value);
      return acc;
    }, {} as Record<string, number>);
  }

  async calcularRatio({
    clientId,
    period,
    ratioId,
  }: {
    clientId: number;
    period: string;
    ratioId?: number;
  }) {
    const { evaluate } = await import("mathjs");

    const renta = await this.transformDataScope({ clientId, period });

    const scope = {
      TOTAL_PASIVO_CIRC: renta["70"],
      TOTAL_PASIVO_NO_CIRC: renta["71"],
      TOTAL_ACTIVO_CIRC: renta["68"],
      VENTAS_NETAS: renta["60"],
      CTAS_X_COBRAR_COMER_TERC: renta["3"],
      MERCADERIAS: renta["10"],
      COSTO_DE_VENTAS: renta["56"],
      CTAS_POR_PAGAR_COMERC_TERCEROS_TPCIRC: renta["35"],
      CTAS_POR_PAGAR_COMERC_TERCEROS_TPNCIRC: 0,
      CTAS_POR_PAGAR_ACC_DIREC_GER_TPCIRC: renta["37"],
      CTAS_POR_PAGAR_ACC_DIREC_GER_TPNCIRC: 0,
      CAPITAL: renta["43"],
      TOTAL_ACTIVOS: renta["73"],
      RESULTADO_DE_OPERACION: renta["74"],
      UTILIDAD_NETA: renta["75"],
      TOTAL_PATRIMONIO: renta["76"],
    };
    if (ratioId) {
      const ratio = await this.ratioFinanciero.findByRatio(ratioId);
      if (!ratio) {
        throw new NotFoundObjectError("Ratio no encontrada");
      }

      let resultado;
      try {
        resultado = evaluate(ratio.formula, scope);
      } catch {
        resultado = null;
      }

      return {
        period,
        clientId,
        ratioId: ratioId,
        resultado,
      };
    } else {
      const ratios = await this.ratioFinanciero.findAllRatio();
      if (!ratios || ratios.length === 0) {
        throw new NotFoundObjectError("No hay ratios definidos");
      }
      return ratios.map((rat) => {
        let resultado;
        try {
          resultado = evaluate(rat.formula, scope);
        } catch {
          resultado = null;
        }
        return {
          period,
          clientId,
          ratioId: rat.id,
          resultado,
        };
      });
    }
  }

  async createRatioFinanciero({
    clientId,
    period,
    ratioFinancieroId,
  }: {
    clientId?: number;
    period?: string;
    ratioFinancieroId?: number;
  }) {
    if (clientId == null || !period) {
      throw new BadRequestError("clientId y period son requeridos");
    }

    let resultados;
    if (typeof ratioFinancieroId === "number") {
      resultados = await this.calcularRatio({
        clientId,
        period,
        ratioId: ratioFinancieroId,
      });
    } else {
      resultados = await this.calcularRatio({
        clientId,
        period,
      });
    }

    const resultsArray = Array.isArray(resultados) ? resultados : [resultados];

    await Promise.all(
      resultsArray.map((r) =>
        this.detalleRatioRepository.create({
          data: {
            period: r.period,
            clientId: r.clientId,
            ratioFinancieroId: r.ratioId,
            resultado: r.resultado,
          },
          options: {},
        })
      )
    );

    return { message: "Ratios guardados correctamente" };
  }
}
