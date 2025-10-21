import { Sequelize } from "sequelize-typescript";
import { Config } from "../../config";
import { Dialect } from "sequelize";

import ClientFinancing from "@/models/ClientFinancing";
import DiccionarioFinanciero from "@/models/DiccionarioFinanciero";
import Client from "@/models/Client";
import TipoRatio from "@/models/TipoRatio";
import RatioFinanciero from "@/models/RatioFinanciero";
import DetalleRatio from "@/models/DetalleRatio";

const connection = new Sequelize({
  dialect: Config.database.connections.driver as Dialect,
  host: Config.database.connections.host,
  username: Config.database.connections.username,
  password: Config.database.connections.password,
  database: Config.database.connections.database,
  port: Number(Config.database.connections.port),
  logging: false,
  sync: { alter: true },
  models: [
    Client,
    ClientFinancing,
    DiccionarioFinanciero,
    TipoRatio,
    RatioFinanciero,
    DetalleRatio
  ],
});

export default connection;
