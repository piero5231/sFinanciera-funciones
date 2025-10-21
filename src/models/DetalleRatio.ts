import { Optional } from "sequelize";
import {
  Column,
  DataType,
  BelongsTo,
  Model,
  Table,
  ForeignKey,
} from "sequelize-typescript";

import Client from "./Client";
import RatioFinanciero from "./RatioFinanciero";

interface DetalleRatioAttributes {
  id: number;
  period: string;
  clientId: number;
  ratioFinancieroId: number;
  resultado: number;
}

export type DetalleRatioCreationAttributes = Optional<
  DetalleRatioAttributes,
  "id"
>;
@Table({
  modelName: "detalleRatio",
  timestamps: false,
  tableName: "detalle_ratio",
})
class DetalleRatio extends Model<
  DetalleRatioAttributes,
  DetalleRatioCreationAttributes
> {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.BIGINT,
    autoIncrement: true,
    get() {
      return Number(this.getDataValue("id"));
    },
  })
  public id!: number;

  @Column({
    allowNull: false,
    type: DataType.CHAR(4),
  })
  public period!: string;

  @ForeignKey(() => Client)
  @Column({
    allowNull: false,
    type: DataType.BIGINT,
    references: {
      key: "id",
      model: "clients",
    },
    onUpdate: "RESTRICT",
    onDelete: "RESTRICT",
  })
  public clientId!: number;

  @ForeignKey(() => RatioFinanciero)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
    references: {
      key: "id",
      model: "ratio_financiero",
    },
    onUpdate: "RESTRICT",
    onDelete: "RESTRICT",
  })
  public ratioFinancieroId!: number;

  @Column({
    allowNull: false,
    type: DataType.DECIMAL(10, 2),
    get() {
      return Number(this.getDataValue("resultado"));
    },
  })
  public resultado!: number;

  @BelongsTo(() => Client, {
    foreignKey: "clientId",
    targetKey: "id",
    as: "client",
  })
  public client!: Client;

  @BelongsTo(() => RatioFinanciero, {
    foreignKey: "ratioFinancieroId",
    targetKey: "id",
    as: "ratio_financiero",
  })
  public ratioFinanciero!: RatioFinanciero;
}
export default DetalleRatio;
