import { Optional } from "sequelize";
import {
  Column,
  DataType,
  BelongsTo,
  Model,
  Table,
  ForeignKey,
} from "sequelize-typescript";
import DiccionarioFinanciero from "./DiccionarioFinanciero";
import Client from "./Client";

interface ClientFinancingAttributes {
  id: number;
  period: string;
  diccionarioId: number;
  clientId: number;
  value: number;
}

export type ClientFinancingCreationAttributes = Optional<
  ClientFinancingAttributes,
  "id"
>;
@Table({
  modelName: "ClientFinancing",
  timestamps: false,
  tableName: "client_financing",
})
class ClientFinancing extends Model<
  ClientFinancingCreationAttributes,
  ClientFinancingCreationAttributes
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

  @ForeignKey(() => DiccionarioFinanciero)
  @Column({
    allowNull: false,
    type: DataType.BIGINT,
    references: {
      key: "id",
      model: "diccionario_financiero",
    },
    onUpdate: "RESTRICT",
    onDelete: "RESTRICT",
  })
  public diccionarioId!: number;

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

  @Column({
    allowNull: false,
    type: DataType.DECIMAL(10, 2),
    get() {
      return Number(this.getDataValue("value"));
    },
  })
  public value!: number;

  @BelongsTo(() => Client, {
    foreignKey: "clientId",
    targetKey: "id",
    as: "client",
  })
  public client!: Client;

  @BelongsTo(() => DiccionarioFinanciero, {
    foreignKey: "diccionarioId",
    targetKey: "id",
    as: "diccionario",
  })
  public diccionario!: DiccionarioFinanciero;
}
export default ClientFinancing;
