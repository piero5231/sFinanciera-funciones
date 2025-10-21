import { Optional } from "sequelize";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import ClientFinancing from "./ClientFinancing";

interface DiccionarioFinancieroAttributes {
    id: number;
    name: string;
    code?: string;
    category?: string;
    group: string
}

export type DiccionarioFinancieroCreationAttributes = Optional<DiccionarioFinancieroAttributes, "id">;

@Table({
    modelName: "DiccionarioFinanciero",
    timestamps: false,
    tableName: "diccionario_financiero",
})
class DiccionarioFinanciero extends Model<DiccionarioFinancieroCreationAttributes, DiccionarioFinancieroCreationAttributes> {
    @Column({
        allowNull: false,
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
        get () {
            return Number(this.getDataValue("id"));
        }
    })
    public id!: number;

    @Column({
        allowNull: false,
        type: DataType.STRING(255),
    })
    public name!: string;

    @Column({
        allowNull: true,
        type: DataType.STRING(100),
    })
    public code!: string;

    @Column({
        allowNull: true,
        type: DataType.STRING(150),
    })
    public category!: string;

    @Column({
        allowNull: false,
        type: DataType.STRING(255),
    })
    public group!: string;

    @HasMany(() => ClientFinancing, {
        foreignKey: "diccionarioId",
        sourceKey: "id",
        as: "detalles",
    })
    public detalles!: ClientFinancing[];
}

export default DiccionarioFinanciero;