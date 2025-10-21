import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsString,Length } from "class-validator";

export class DetalleRatioRequest {
    @IsNotEmpty()
    @IsString()
    @Length(4, 4)
    @Type(() => String)
    public period!: string;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    public clientId!: number;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    public ratioFinancieroId!: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    public resultado!: number;
}