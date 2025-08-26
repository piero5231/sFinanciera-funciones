import { Router } from "express";
import Container from "typedi";
import { ScrapingController } from "../controllers/ScrapingController";

const router = Router();
const scrapingController = Container.get(ScrapingController);

router.get("/osce", scrapingController.getOsce);

router.get("/mtc", scrapingController.getMtc);

router.get("/sunat", scrapingController.getSunat);

router.get("/tipoCambio", scrapingController.getTipoCambio);

router.get("/ofac", scrapingController.getOfac);

export default router;
