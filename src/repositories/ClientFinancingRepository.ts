import { Service } from "typedi";
import ClientFinancing from "@/models/ClientFinancing";

@Service()
export default class ClientFinancingRepository {
  async findByClientRenta({
    clientId,
    period,
  }: {
    clientId: number;
    period: string;
  }): Promise<ClientFinancing[]> {
    return await ClientFinancing.findAll({
      attributes: ["diccionarioId", "value"],
      where: { clientId, period },
      raw: true,
    });
  }

  async findAllClientFinancing(): Promise<ClientFinancing[]> {
    return await ClientFinancing.findAll();
  }
}
