import { Request } from "express";

export type RequestBody<T = any> = Request<any, {}, T>;
export type RequestQuery<T = any> = Request<{}, {}, {}, T>;