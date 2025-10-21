import { Service } from "typedi";
import RatioFinancieroService from "@/services/RatioFinancieroService";
import FlujoEfectivoService from "@/services/FlujoEfectivoService";
import { Request, Response } from "express";

@Service()
export class RatioFinancieroController {
  constructor(
    public ratioFinancieroService: RatioFinancieroService,
    public flujoEfectivoService: FlujoEfectivoService
  ) {}

  calcularRatio = async (req: Request, res: Response) => {
    try {
      const { clientId, period, ratioId } = req.body;
      if (!clientId) {
        return res
          .status(400)
          .json({ error: "El campo clientId es obligatorio" });
      }

      const calcularRatio = await this.ratioFinancieroService.calcularRatio({
        clientId: Number(clientId),
        period: String(period),
        ratioId: ratioId ? Number(ratioId) : undefined,
      });
      return res.status(200).json(calcularRatio);
    } catch (er: any) {
      return res
        .status(500)
        .json({ error: er.message || "Error Interno en el Servidor" });
    }
  };

  createDetalleRatio = async (req: Request, res: Response) => {
    try {
      const { clientId, period, ratioId } = req.body;

      if (!clientId) {
        return res
          .status(400)
          .json({ error: "El campo clientId es obligatorio" });
      }
      if (!period) {
        return res
          .status(400)
          .json({ error: "El campo period es obligatorio" });
      }

      const result = await this.ratioFinancieroService.createRatioFinanciero({
        clientId: Number(clientId),
        period: String(period),
        ratioFinancieroId:
          typeof ratioId !== "undefined" ? Number(ratioId) : undefined,
      });

      return res.status(200).json(result);
    } catch (er: any) {
      return res
        .status(500)
        .json({ error: er.message || "Error Interno en el Servidor" });
    }
  };

  calcularFlujoEfectivo = async (req: Request, res: Response) => {
    try {
      const { clientId, period } = req.body;
      if (!clientId) {
        return res
          .status(400)
          .json({ error: "El campo clientId es obligatorio" });
      }

      const calcularFlujo = await this.flujoEfectivoService.calcularFlujoEfectoByRenta(
        Number(clientId),
        String(period)
      );
      return res.status(200).json(calcularFlujo);
    } catch (er: any) {
      return res
        .status(500)
        .json({ error: er.message || "Error Interno en el Servidor" });
    }
  };
}
