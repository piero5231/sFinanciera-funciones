import { Includeable, Transaction } from "sequelize";

export type ResponsePagination<T> = {
    count: number;
    rows: T[];
};

export type Options = {
    transaction?: Transaction;
    include?: Includeable | Includeable[]
}

export interface BodyDTO<T> {
    data: T;
    options?: Options;
}