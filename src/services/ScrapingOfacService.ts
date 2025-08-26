import puppeteerExtra from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import type { Browser, Page } from "puppeteer";
import * as path from "path";
import * as os from "os";

puppeteerExtra.use(StealthPlugin());
const puppeteer = puppeteerExtra;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function initBrowser(): Promise<{ browser: Browser; page: Page }> {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  });
  const page = await browser.newPage();
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:90.0) Gecko/20100101 Firefox/90.0",
  ];
  await page.setUserAgent(
    userAgents[Math.floor(Math.random() * userAgents.length)]
  );
  await page.setViewport({ width: 1200, height: 800 });
  return { browser, page };
}

/**
 * Realiza una búsqueda en https://sanctionssearch.ofac.treas.gov/
 * Inserta `value` en #ctl00_MainContent_txtID y hace click en
 * #ctl00_MainContent_btnSearch (selector proporcionado).
 * Genera un PDF llamado OFAC_<valor>.pdf en el Escritorio, espera 3s y cierra el navegador.
 */
export async function scrapingOfacService(value: string): Promise<void> {
  if (!value || typeof value !== "string") {
    throw new Error("Se requiere un valor (string) para realizar la búsqueda.");
  }

  // sanitizar valor para nombre de archivo (reemplaza caracteres inválidos por _)
  const safeValue = value.replace(/[^a-zA-Z0-9\-_.]/g, "_");
  const pdfFileName = `OFAC_${safeValue}.pdf`;

  // Construir ruta al Escritorio del usuario
  const desktopDir = path.join(os.homedir(), "Desktop");
  const pdfFilePath = path.join(desktopDir, pdfFileName);

  const url = "https://sanctionssearch.ofac.treas.gov/";
  const maxRetries = 5;
  let attempt = 0;
  let browser: Browser | undefined;
  let page: Page | undefined;

  while (attempt < maxRetries) {
    attempt++;
    try {
      ({ browser, page } = await initBrowser());

      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
      await delay(1200);

      const inputSelector = "#ctl00_MainContent_txtID";
      const searchBtnSelector = "#ctl00_MainContent_btnSearch";

      await page.waitForSelector(inputSelector, { timeout: 10000 });

      // Establecer valor en el input y despachar eventos
      await page.evaluate(
        (sel, val) => {
          const el = document.querySelector<HTMLInputElement>(sel);
          if (!el) throw new Error("El input no existe en la página.");
          el.focus();
          el.value = "";
          el.value = val;
          el.dispatchEvent(new Event("input", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
        },
        inputSelector,
        value
      );

      // Intentamos primero click en el botón exacto que nos diste
      let submitted = false;
      try {
        await page.waitForSelector(searchBtnSelector, { timeout: 5000 });
        try {
          await Promise.all([
            page.click(searchBtnSelector),
            page
              .waitForNavigation({
                waitUntil: "domcontentloaded",
                timeout: 7000,
              })
              .catch(() => {}),
          ]);
          submitted = true;
        } catch {
          try {
            await page.click(searchBtnSelector);
            submitted = true;
          } catch {}
        }
      } catch {
        submitted = false;
      }

      // Fallback: buscar y click en botones con texto 'Search' o 'Buscar' sin usar $x
      if (!submitted) {
        const clicked = await page
          .$$eval(
            "button",
            (buttons, searchWords) => {
              for (const b of buttons as HTMLElement[]) {
                const txt = (b.innerText || "").trim().toLowerCase();
                if (searchWords.some((w: string) => txt.includes(w))) {
                  (b as HTMLElement).click();
                  return true;
                }
              }
              return false;
            },
            ["search", "buscar"]
          )
          .catch(() => false);

        if (clicked) {
          try {
            await page
              .waitForNavigation({
                waitUntil: "domcontentloaded",
                timeout: 7000,
              })
              .catch(() => {});
          } catch {}
          submitted = true;
        }
      }

      // Otros fallbacks: input[type=submit] o Enter
      if (!submitted) {
        const submitInputs = await page.$$(
          "input[type='submit'], input[type='button'], button[type='submit']"
        );
        if (submitInputs.length > 0) {
          for (const el of submitInputs) {
            try {
              await el.click();
              submitted = true;
              break;
            } catch {}
          }
        }
      }

      if (!submitted) {
        try {
          await page.focus(inputSelector);
          await page.keyboard.press("Enter");
          submitted = true;
        } catch {}
      }

      if (!submitted)
        throw new Error("No se pudo disparar la acción de búsqueda (submit).");

      // ---------- Generar PDF en el Escritorio ----------
      try {
        await (page as any).pdf({
          path: pdfFilePath,
          format: "A4",
          printBackground: true,
        });
      } catch {
        // si falla la generación del PDF no interrumpimos el flujo principal
      }

      // Esperar 3 segundos como pediste
      await delay(3000);

      if (browser) await browser.close();
      return;
    } catch (err: any) {
      try {
        if (browser) await browser.close();
      } catch {}
      await delay(1000 * attempt);
      if (attempt >= maxRetries) {
        throw new Error(
          `performOfacSearch: Falló después de ${maxRetries} intentos. Último error: ${err?.message || err}`
        );
      }
      // continuar para reintentar
    } finally {
      try {
        if (page) {
          await page
            .evaluate(() => {
              if (document && document.body) document.body.innerHTML = "";
            })
            .catch(() => {});
        }
      } catch {}
    }
  }

  if (browser) await browser.close().catch(() => {});
}
