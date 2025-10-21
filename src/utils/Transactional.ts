import connection from "../database/config/sequelizeClient";
import { Transaction } from "sequelize";

export async function transactional<T>(callback: (transaction: Transaction) => Promise<T>): Promise<T> {
    const transaction = await connection.transaction();
    try {
        const result = await callback(transaction);
        await transaction.commit();
        return result;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}