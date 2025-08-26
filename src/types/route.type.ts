import { Router } from "express";

export interface IApiRoute {
    path: string;
    route: Router;
}