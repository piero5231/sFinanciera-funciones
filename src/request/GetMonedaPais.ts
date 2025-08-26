import { Transform} from "class-transformer";
import { Matches } from "class-validator";

export class GetPaisRequest {

  @Transform(({ value }) => {
    if (value === null || value === undefined) return "";
    return String(value)
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  })
  @Matches(/^(|union europea)$/, {
    message: "Solo se acepta vacío o 'Unión Europea'",
  })
  public pais!: string;
}
