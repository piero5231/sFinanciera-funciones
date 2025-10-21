import { Optional } from "sequelize";
import {
  Column,
  DataType,
  BelongsTo,
  Model,
  Table,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from "sequelize-typescript";

import TipoRatio from "./TipoRatio";

interface RatioFinancieroAttributes {
  id: number;
  name: string;
  tipoRatioId: number;
  formula: string;
}

type RatioFinancieroCreationAttributes = Optional<
  RatioFinancieroAttributes,
  "id"
>;
@Table({
  modelName: "RatioFinanciero",
  timestamps: false,
  tableName: "ratio_financiero",
})
class RatioFinanciero extends Model<
  RatioFinancieroAttributes,
  RatioFinancieroCreationAttributes
> {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  public name!: string;

  @ForeignKey(() => TipoRatio)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public tipoRatioId!: number;

  @BelongsTo(() => TipoRatio, "tipoRatioId")
  public tipoRatio!: TipoRatio;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  public formula!: string;

}
export default RatioFinanciero;
