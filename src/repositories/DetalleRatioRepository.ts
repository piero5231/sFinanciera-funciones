import { BodyDTO, Options } from "@/types/response.type";
import { Service } from "typedi";
import DetalleRatio, {
  DetalleRatioCreationAttributes,
} from "@/models/DetalleRatio";

@Service()
export default class DetalleRatioRepository {
  async create(
    body: BodyDTO<DetalleRatioCreationAttributes>
  ): Promise<DetalleRatio> {
    const { data, options } = body;
    return await DetalleRatio.create(data, options);
  }
}
