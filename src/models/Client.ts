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
  BelongsToMany,
} from "sequelize-typescript";
import { TypeDocument } from "../types/client.types";
import ClientFinancing from "./ClientFinancing";

interface ClientAttributes {
  id: number;
  typeDocument: TypeDocument;
  nDocument: string;
  typeTaxPayer?: string;
  name: string;
  beginActivities?: string;
  inscriptionDate?: string;
  stateTaxPayer?: string;
  conditionTaxPayer?: string;
  address?: string;
  createdBy: string;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ClientCreationAttributes = Optional<ClientAttributes, "id">;
@Table({
  modelName: "Client",
  timestamps: true,
  tableName: "clients",
})
class Client extends Model<ClientCreationAttributes, ClientCreationAttributes> {
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
    type: DataType.ENUM(...Object.values(TypeDocument)),
    allowNull: false,
    defaultValue: TypeDocument.RUC,
  })
  public typeDocument!: TypeDocument;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  public nDocument!: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  public typeTaxPayer!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  public name!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  public beginActivities!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  public inscriptionDate!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  public stateTaxPayer!: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  public conditionTaxPayer!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  public address!: string;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  public createdBy!: string;

  @Column({
    allowNull: true,
    type: DataType.UUID,
    defaultValue: null,
  })
  public updatedBy!: string | null;

  @CreatedAt
  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  public createdAt?: Date;

  @UpdatedAt
  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  public updatedAt?: Date;

  @HasMany(() => ClientFinancing, {
    foreignKey: "clientId",
    sourceKey: "id",
  })
  public clientFinancing?: ClientFinancing[];
}
export default Client;
