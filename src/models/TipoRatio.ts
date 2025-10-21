import { Optional } from "sequelize";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import RatioFinanciero from "./RatioFinanciero";

interface TipoRatioAttributes {
  id: number;
  name: string;
}

type TipoRatioCreationAttributes = Optional<TipoRatioAttributes, "id">;
@Table({
  modelName: "TipoRatio",
  timestamps: true,
  tableName: "tipo_ratio",
})
class TipoRatio extends Model<
  TipoRatioAttributes,
  TipoRatioCreationAttributes
> {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.NUMBER,
  })
  public id!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  public name!: string;

  @HasMany(() => RatioFinanciero, {
    foreignKey: "tipoRatioId",
    sourceKey: "id",
  })
  public ratioFinanciero?: RatioFinanciero[];
}
export default TipoRatio;
