import { Service } from "typedi";
import RatioFinanciero from "@/models/RatioFinanciero";

@Service()
export default class RatioFinancieroRepository {
  async findByRatio(id: number): Promise<RatioFinanciero | null> {
    return await RatioFinanciero.findByPk(id);
  }

  async findAllRatio(): Promise<RatioFinanciero[]> {
    return await RatioFinanciero.findAll();
  }
}
