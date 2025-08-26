// src/services/TipoCambioService.ts
import { Service } from "typedi";
import puppeteer, { Browser, Page } from "puppeteer";

@Service()
export class TipoCambioService {
  private readonly url =
    "https://www.sbs.gob.pe/app/pp/SISTIP_PORTAL/Paginas/Publicacion/TipoCambioContable.aspx";

  private normalize(s: string): string {
    return s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  async obtenerTipoCambioExacto(pais?: string): Promise<string> {
    let browser: Browser | null = null;

    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page: Page = await browser.newPage();

      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.88 Safari/537.36"
      );

      await page.goto(this.url, { waitUntil: "domcontentloaded" });

      if (!pais) {
        await page.waitForSelector(
          "thead .rgMultiHeaderRow > th:nth-child(3)",
          {
            timeout: 90_000,
          }
        );

        const headerText = await page.evaluate(() => {
          const th = document.querySelector(
            "thead .rgMultiHeaderRow > th:nth-child(3)"
          );
          return th?.textContent?.trim() ?? "No encontrado";
        });

        return headerText;
      } else {
        const target = this.normalize(pais);

        await page.waitForSelector("td.APLI_fila3", { timeout: 90_000 });

        const resultado = await page.evaluate((normalizedTarget: string) => {
          const normalizeInner = (s: string) =>
            s
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .trim();

          const tds = Array.from(document.querySelectorAll("td.APLI_fila3"));

          for (const td of tds) {
            const text = (td.textContent || "").trim();
            if (normalizeInner(text) === normalizedTarget) {
              const valores: string[] = [];
              let sibling = td.nextElementSibling;
              while (sibling) {
                if (
                  sibling.classList &&
                  sibling.classList.contains("APLI_fila2")
                ) {
                  valores.push((sibling.textContent || "").trim());
                }
                sibling = sibling.nextElementSibling;
              }
              if (valores.length >= 2) {
                return valores[1];
              } else {
                return "Parámetro incorrecto";
              }
            }
          }

          return "Parámetro incorrecto";
        }, target);

        return resultado;
      }
    } catch (error) {
      console.error("Error al obtener el tipo de cambio exacto:", error);
      return "Error al obtener el tipo de cambio";
    } finally {
      if (browser) {
        try {
          await browser.close();
        } catch (closeErr) {
          console.warn("Error cerrando el browser:", closeErr);
        }
      }
    }
  }
}

export default TipoCambioService;
