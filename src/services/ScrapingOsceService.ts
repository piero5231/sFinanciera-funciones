import puppeteer, { Browser, Page, CDPSession } from "puppeteer";
import path from "path";
import os from "os";
import fs from "fs";

const MAX_REINTENTOS = 20;

export async function webScrapingOSCE(
  valor: string,
  reintento = 0
): Promise<void> {
  const rutaCarpOsce = path.join(os.homedir(), "Desktop");
  // const rutaCarpOsce = path.join(os.homedir(), "Downloads");

  const url = "https://apps.osce.gob.pe/perfilprov-ui/";
  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page: Page = await browser.newPage();

    const client: CDPSession = await page.createCDPSession();
    await client.send("Browser.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: rutaCarpOsce,
    });

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.88 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "networkidle2" });

    try {
      await page.waitForSelector("#textBuscar", { timeout: 4000 });
    } catch (err) {
      await browser.close();
      if (reintento < MAX_REINTENTOS) {
        return webScrapingOSCE(valor, reintento + 1);
      }
      return;
    }

    await page.type("#textBuscar", valor, { delay: 100 });
    await page.waitForSelector("#btnBuscar", { timeout: 10000 });
    await page.click("#btnBuscar");

    try {
      await page.waitForSelector(`a[href="/perfilprov-ui/ficha/${valor}"]`, {
        timeout: 10000,
      });
    } catch {
      await browser.close();
      return;
    }

    await page.click(`a[href="/perfilprov-ui/ficha/${valor}"]`);
    await page.waitForSelector(
      `a[href="/perfilprov-ui/ficha/${valor}/contratos"]`,
      { timeout: 10000 }
    );
    await page.click(`a[href="/perfilprov-ui/ficha/${valor}/contratos"]`);

    try {
      await page.waitForSelector("#btnExcel", {
        visible: true,
        timeout: 15000,
      });

      await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
          let totalHeight = 0;
          const distance = 100;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });

      await new Promise((r) => setTimeout(r, 2000));

      await page.waitForFunction(
        () => {
          const btn = document.querySelector("#btnExcel");
          return btn && !btn.hasAttribute("disabled");
        },
        { timeout: 10000 }
      );

      await page.click("#btnExcel");

      const nombreArchivoEsperado = "contratos.xlsx";
      const rutaArchivo = path.join(rutaCarpOsce, nombreArchivoEsperado);

      await new Promise<void>((resolve, reject) => {
        const maxTiempo = 30000;
        const inicio = Date.now();

        const interval = setInterval(() => {
          if (fs.existsSync(rutaArchivo)) {
            clearInterval(interval);
            resolve();
          }
          if (Date.now() - inicio > maxTiempo) {
            clearInterval(interval);
            reject(new Error("Tiempo de espera agotado para descarga"));
          }
        }, 1000);
      });
      //console.log(`Descarga completada en: ${rutaCarpOsce}`);
    } catch {
      // console.warn(
      //   `Botón de Excel no encontrado para ${valor}. No se descargó.`
      // );
    }
  } catch (error) {
    console.error("Error durante el scraping:", error);
  } finally {
    if (browser) await browser.close();
  }
}
