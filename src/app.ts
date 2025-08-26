import "reflect-metadata"; 
import express from "express";
import cors from "cors";
import { MetSolesRouter, ScrapingRouter } from "./routes";

const app = express();

app.use(cors());
app.use(express.json()); 

app.use("/api/v1", MetSolesRouter);
app.use("/api/v1", ScrapingRouter);

export default app;

