import { Service } from "typedi";
import { extraerYProcesarValores } from "../services/AutomatizadorService";
import { webScrapingOSCE } from "../services/ScrapingOsceService";
import { scrapingMtc } from "../services/ScrapingMtcService";
import { scrapingOfacService } from "../services/ScrapingOfacService";
import { TipoCambioService } from "../services/TipoCambioService";
import { scrapingSunat } from "../services/ScrapingSunatService";
import { RequestBody } from "@/types/body.type";
import { GetNumDocumentoRequest } from "../request/GetNumDocumento";
import { ApiWrapper } from "@/utils/ApiWrapper";
import { SuccessResponse } from "@/utils/SuccessResponse";
import { GetPaisRequest } from "../request/GetMonedaPais";

@Service()
export class ScrapingController {
  getOsce = ApiWrapper(async (req: RequestBody<GetNumDocumentoRequest>) => {
    const { numeroDocumento } = req.body;
    await webScrapingOSCE(numeroDocumento);

    const osce = await extraerYProcesarValores();
    if (!osce) {
      return new SuccessResponse(
        null,
        404,
        `No se Encontraron Resultados para el Numero de Documento Ingresado: ${numeroDocumento}`
      );
    }
    return new SuccessResponse(osce, 200, "Datos Obtenidos Correctamente");
  });

  getMtc = ApiWrapper(async (req: RequestBody<GetNumDocumentoRequest>) => {
    const { numeroDocumento } = req.body;
    const mtc = await scrapingMtc(numeroDocumento);

    if (!mtc) {
      return new SuccessResponse(
        null,
        404,
        `No se Encontraron Resultados para el Numero de Documento Ingresado: ${numeroDocumento}`
      );
    }
    return new SuccessResponse(mtc, 200, "Datos Obtenidos Correctamente");
  });

  getSunat = ApiWrapper(async (req: RequestBody<GetNumDocumentoRequest>) => {
    const { numeroDocumento } = req.body;
    const sunat = await scrapingSunat(numeroDocumento);

    if (!sunat) {
      return new SuccessResponse(
        null,
        404,
        `No se Encontraron Resultados para el Numero de Documento Ingresado: ${numeroDocumento}`
      );
    }
    return new SuccessResponse(sunat, 200, "Datos Obtenidos Correctamente");
  });

  getTipoCambio = ApiWrapper(async (req: RequestBody<GetPaisRequest>) => {
    const { pais } = req.body;
    const tipo = new TipoCambioService();
    const tipoCambio = await tipo.obtenerTipoCambioExacto(pais);

    if (!tipoCambio) {
      return new SuccessResponse(null, 404, `No se Encontraron Resultados`);
    }
    return new SuccessResponse(
      tipoCambio,
      200,
      "Datos Obtenidos Correctamente"
    );
  });

  getOfac = ApiWrapper(async (req: RequestBody<{ valor: string }>) => {
    const { valor } = req.body;
    await scrapingOfacService(valor);
    return new SuccessResponse(null, 200, "Búsqueda OFAC realizada correctamente");
  });
}
