import { Router } from "express";
import multer from "multer";
import Container from "typedi";
import { MetSolesController } from "../controllers/MetSolesController";

const router = Router();
const metSolesController = Container.get(MetSolesController);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

router.post(
  "/subir-pdf-renta",
  upload.single("pdf"),
  metSolesController.subirPdfRenta
);

router.post(
  "/subir-pdf-venta",
  upload.single("pdf"),
  metSolesController.subirPdfVenta
);

export default router;
