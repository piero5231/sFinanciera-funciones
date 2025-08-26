// src/services/PdfService.ts
import { Service } from "typedi";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

type RunOptions = {
  timeoutMs?: number;
  pythonBinOrVenvPath?: string;
};

@Service()
export class MetSolesService {
  private resolvePythonBinary(pythonBinOrVenvPath?: string): string {
    if (pythonBinOrVenvPath) {
      const candidate = path.resolve(pythonBinOrVenvPath);
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile())
        return candidate;

      const maybeScriptsExe = path.resolve(pythonBinOrVenvPath, "python.exe");
      const maybeScripts = path.resolve(
        pythonBinOrVenvPath,
        "Scripts",
        "python.exe"
      );
      const maybeUnix = path.resolve(pythonBinOrVenvPath, "bin", "python");

      if (fs.existsSync(maybeScriptsExe)) return maybeScriptsExe;
      if (fs.existsSync(maybeScripts)) return maybeScripts;
      if (fs.existsSync(maybeUnix)) return maybeUnix;

      if (!candidate.endsWith(".exe")) {
        const withExe = candidate + ".exe";
        if (fs.existsSync(withExe)) return withExe;
      }
    }

    const cwd = process.cwd();
    const venvWin = path.join(cwd, ".venv", "Scripts", "python.exe");
    const venvUnix = path.join(cwd, ".venv", "bin", "python");

    if (fs.existsSync(venvWin)) return venvWin;
    if (fs.existsSync(venvUnix)) return venvUnix;

    return "python";
  }

  async runPython(
  pdfBuffer: Buffer,
  scriptName: string,
  opts: RunOptions = {}
): Promise<any> {
  const pythonBin = this.resolvePythonBinary(opts.pythonBinOrVenvPath);

  const scriptPath = path.resolve(
    process.cwd(),
    "src",
    "scripts",
    scriptName
  );

  if (!fs.existsSync(scriptPath)) {
    throw new Error(`Python script not found: ${scriptPath}`);
  }

  const timeoutMs = opts.timeoutMs ?? 60_000;

  return new Promise((resolve, reject) => {
    const proc = spawn(pythonBin, [scriptPath, "-"], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let finished = false;

    const timer = setTimeout(() => {
      if (!finished) {
        proc.kill("SIGKILL");
        finished = true;
        reject(new Error(`Python process timed out after ${timeoutMs}ms`));
      }
    }, timeoutMs);

    proc.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    proc.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    proc.on("error", (err) => {
      clearTimeout(timer);
      if (!finished) {
        finished = true;
        reject(err);
      }
    });

    proc.on("close", (code) => {
      clearTimeout(timer);
      if (finished) return;
      finished = true;

      if (code !== 0) {
        const combined = stderr || stdout;
        try {
          const parsed = JSON.parse(combined);
          reject(new Error(`Python error: ${JSON.stringify(parsed)}`));
        } catch {
          reject(
            new Error(`Python exited with code ${code}. Stderr: ${stderr}`)
          );
        }
        return;
      }

      try {
        const parsed = JSON.parse(stdout);
        resolve(parsed);
      } catch {
        reject(
          new Error(
            `Invalid JSON from Python script. Raw stdout: ${stdout}. Stderr: ${stderr}`
          )
        );
      }
    });

    proc.stdin.write(pdfBuffer);
    proc.stdin.end();
  });
}

}
