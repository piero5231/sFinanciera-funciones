import { Transform } from "class-transformer";
import { IsNotEmpty, Matches } from "class-validator";

export class GetNumDocumentoRequest {
  @Transform(({ value }) => String(value).trim())
  @IsNotEmpty({ message: "El número de documento es obligatorio" })
  @Matches(/^(?:\d{8}|\d{11})$/, { message: "Debe tener 8 o 11 dígitos" })
  public numeroDocumento!: string;
}
