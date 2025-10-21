import { Router } from "express";
import Container from "typedi";
import { RatioFinancieroController } from "@/controllers/RatioFinancieroController";

const router = Router();
const ratioFinancieroController = Container.get(RatioFinancieroController);


router.post(
  "/calcular-ratios",
  ratioFinancieroController.calcularRatio
);

router.post(
  "/detalle-ratio",
  ratioFinancieroController.createDetalleRatio
);

router.post(
  "/calcular-flujo-efectivo",
  ratioFinancieroController.calcularFlujoEfectivo
);

export default router;