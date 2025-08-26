import { Service } from "typedi";
import { MetSolesService } from "../services/MetSolesService";
import { Request, Response } from "express";

@Service()
export class MetSolesController {
  constructor(private readonly metSolesService: MetSolesService) {}

  subirPdfRenta = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ error: "Falta archivo PDF (field 'pdf')" });
      }

      const buffer = req.file.buffer as Buffer;
      const pythonVenv = process.env.PYTHON_VENV_PATH;

      const result = await this.metSolesService.runPython(
        buffer,
        "metSoles.py",
        {
          pythonBinOrVenvPath: pythonVenv,
          timeoutMs: 60_000,
        }
      );

      if (result && (result as any).error) {
        return res.status(500).json({ error: (result as any).error });
      }

      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ error: err.message ?? String(err) });
    }
  };

  subirPdfVenta = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ error: "Falta archivo PDF (field 'pdf')" });
      }

      const buffer = req.file.buffer as Buffer;
      const pythonVenv = process.env.PYTHON_VENV_PATH;

      const result = await this.metSolesService.runPython(buffer, "venta.py", {
        pythonBinOrVenvPath: pythonVenv,
        timeoutMs: 60_000,
      });

      if (result && (result as any).error) {
        return res.status(500).json({ error: (result as any).error });
      }

      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ error: err.message ?? String(err) });
    }
  };

  
}
