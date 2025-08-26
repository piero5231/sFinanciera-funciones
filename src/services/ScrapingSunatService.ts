import puppeteerExtra from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import type { Browser, Page } from "puppeteer";

puppeteerExtra.use(StealthPlugin());
const puppeteer = puppeteerExtra;

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

interface DatosPrincipales {
  identificacion: string;
  namePanel: string;
  tipoContribuyente: string;
  nombreComercial: string;
  fechaInicio: string;
  fechaActividades: string;
  estadoContribuyente: string;
  condicionContribuyente: string;
  domicilioFiscal: string;
  sistemaEmision: string;
  comercioExterior: string;
  sistemaContabilidad: string;
  actividadPrincipal: string;
  actividadSecundaria1: string;
  actividadSecundaria2: string;
}

interface ResultadoCompleto {
  dataPrincipal: DatosPrincipales;
  cantidadTrabajadores: string[];
  deudaCoactiva: string[];
  representantesLegales: string[][];
}

type Resultado = ResultadoCompleto | "NO_REGISTRADO";

async function initBrowser(): Promise<{ browser: Browser; page: Page }> {
  const browser = await puppeteer.launch({
    headless: true,
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
  return { browser, page };
}

export async function scrapingSunat(
  identificacion: string
): Promise<Resultado> {
  identificacion = identificacion.trim();
  if (
    ![8, 11].includes(identificacion.length) ||
    !/^[0-9]+$/.test(identificacion)
  ) {
    throw new Error(
      "El número de identificación debe tener 8 (DNI) o 11 (RUC) dígitos numéricos."
    );
  }

  const maxRetries = 10;
  let retries = 0;
  let browser: Browser;
  let page: Page;
  ({ browser, page } = await initBrowser());

  while (retries < maxRetries) {
    try {
      await page.goto(
        "https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/FrameCriterioBusquedaWeb.jsp",
        { waitUntil: "domcontentloaded", timeout: 15000 }
      );

      // Formulario según tipo de ID
      if (identificacion.length === 11) {
        await page.type("#txtRuc", identificacion);
        await page.click("#btnAceptar");
      } else {
        await page.click("#btnPorDocumento");
        await page.type("#txtNumeroDocumento", identificacion, { delay: 250 });
        await page.click("#btnAceptar");
        await delay(1500);
        const link = await page.$(
          "body > div > div.row > div > div.panel.panel-primary > div.list-group > a"
        );
        if (link) {
          await Promise.all([
            link.click(),
            page.waitForNavigation({
              waitUntil: "domcontentloaded",
              timeout: 10000,
            }),
          ]);
        }
      }

      await delay(3000);
      if (identificacion.length === 8) {
        const html = await page.content();
        if (html.includes("El Sistema RUC NO REGISTRA")) {
          await browser.close();
          return "NO_REGISTRADO";
        }
      }
      await delay(3000);

      const extraerTexto = async (selector: string) =>
        page
          .$eval(selector, (el) => (el as HTMLElement).innerText.trim())
          .catch(() => "");

      // Ajustes de desplazamiento
      let shiftGlobal = 0;
      let shiftDNI = 0;
      const msg = await extraerTexto(
        "body > div > div.row > div > div.panel.panel-primary > div.list-group > div:nth-child(1) > div > div > p"
      );
      if (msg.toUpperCase().includes("IMPORTANTE:")) shiftGlobal = 1;
      const campo3 = await extraerTexto(
        `body > div > div.row > div > div.panel.panel-primary > div.list-group > div:nth-child(${3 + shiftGlobal}) > div > div.col-sm-7 > p`
      );
      if (campo3.toUpperCase().includes("DNI")) shiftDNI = 1;
      const shift = shiftGlobal + shiftDNI;

      // Datos principales
      const datos: DatosPrincipales = {
        identificacion,
        namePanel: (
          await extraerTexto(
            `body > div > div.row > div > div.panel.panel-primary > div.list-group > div:nth-child(${1 + shiftGlobal}) > div > div.col-sm-7 > h4`
          )
        )
          .split(" - ")
          .slice(1)
          .join(" - "),
        tipoContribuyente: await extraerTexto(
          `body > div > div.row > div > div.panel.panel-primary > div.list-group > div:nth-child(${2 + shiftGlobal}) > div > div.col-sm-7 > p`
        ),
        nombreComercial: await extraerTexto(
          `body > div > div.row > div > div.panel.panel-primary > div.list-group > div:nth-child(${3 + shift}) > div > div.col-sm-7 > p`
        ),
        fechaInicio: await extraerTexto(
          `body > div > div.row > div > div.panel.panel-primary > div.list-group > div:nth-child(${4 + shift}) > div > div:nth-child(2) > p`
        ),
        fechaActividades: await extraerTexto(
          `body > div > div.row > div > div.panel.panel-primary > div.list-group > div:nth-child(${4 + shift}) > div > div:nth-child(4) > p`
        ),
        estadoContribuyente: await extraerTexto(
          `body > div > div.row > div > div.panel.panel-primary > div.list-group > div:nth-child(${5 + shift}) > div > div.col-sm-7 > p`
        ),
        condicionContribuyente: await extraerTexto(
          `body > div > div.row > div > div.panel.panel-primary > div.list-group > div:nth-child(${6 + shift}) > div > div.col-sm-7 > p`
        ),
        domicilioFiscal: await extraerTexto(
          `body > div > div.row > div > div.panel.panel-primary > div.list-group > div:nth-child(${7 + shift}) > div > div.col-sm-7 > p`
        ),
        sistemaEmision: await extraerTexto(
          `body > div > div.row > div > div.panel.panel-primary > div.list-group > div:nth-child(${8 + shift}) > div > div:nth-child(2) > p`
        ),
        comercioExterior: await extraerTexto(
          `body > div > div.row > div > div.panel.panel-primary > div.list-group > div:nth-child(${8 + shift}) > div > div:nth-child(4) > p`
        ),
        sistemaContabilidad: await extraerTexto(
          `body > div > div.row > div > div.panel.panel-primary > div.list-group > div:nth-child(${9 + shift}) > div > div.col-sm-7 > p`
        ),
        actividadPrincipal: await extraerTexto(
          `body > div > div.row > div > div.panel.panel-primary > div.list-group > div:nth-child(${10 + shift}) > div > div.col-sm-7 > table > tbody > tr:nth-child(1) > td`
        ),
        actividadSecundaria1: await extraerTexto(
          `body > div > div.row > div > div.panel.panel-primary > div.list-group > div:nth-child(${10 + shift}) > div > div.col-sm-7 > table > tbody > tr:nth-child(2) > td`
        ),
        actividadSecundaria2: await extraerTexto(
          `body > div > div.row > div > div.panel.panel-primary > div.list-group > div:nth-child(${10 + shift}) > div > div.col-sm-7 > table > tbody > tr:nth-child(3) > td`
        ),
      };

      // Cantidad de trabajadores
      const boton1 =
        "body > div > div.row > div > div:nth-child(5) > div:nth-child(3) > div:nth-child(1) > form > button";
      await page.click(boton1);
      await delay(2000);
      let trabajadores: string[] = [];
      const workersError = await page.$(
        "body > div > div.panel.panel-primary > div.row > div > div > h5"
      );
      if (!workersError) {
        const tbodySel =
          "body > div > div.panel.panel-primary > div.list-group > div > div > div > table > tbody";
        await page.waitForSelector(tbodySel, { timeout: 10000 });
        const rows = await page.$$(tbodySel + " > tr");
        if (rows.length > 0) {
          trabajadores = await page.evaluate(
            (row) =>
              Array.from(
                row.querySelectorAll("td"),
                (cel: Element) => cel.textContent?.trim() || ""
              ),
            rows[rows.length - 1]
          );
        }
      }

      // Deuda coactiva
      const retrocedeSel =
        "body > div > div.col-md-6.hidden-print.text-right > button.btn.btn-danger.btnNuevaConsulta";
      const retrocedeBtn = await page.$(retrocedeSel);
      if (retrocedeBtn) {
        try {
          await Promise.all([
            retrocedeBtn.click(),
            page.waitForNavigation({
              waitUntil: "domcontentloaded",
              timeout: 10000,
            }),
          ]);
        } catch {}
      }
      await delay(2000);
      const boton2 =
        "body > div > div.row > div > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > form > button";
      await page.click(boton2);
      await delay(2000);
      const noDataSel =
        "body > div > div.panel.panel-primary > div.list-group-item > div > div";
      const noDataEl = await page.$(noDataSel);
      let deuda: string[] = [];
      if (noDataEl) {
        const txt = await page.evaluate((el) => el.innerText, noDataEl);
        if (txt.includes("No se ha remitido deuda en cobranza coactiva")) {
          const backBtn = await page.$(retrocedeSel);
          if (backBtn) {
            try {
              await Promise.all([
                backBtn.click(),
                page.waitForNavigation({
                  waitUntil: "domcontentloaded",
                  timeout: 10000,
                }),
              ]);
            } catch {}
          }
          await delay(2000);
        } else {
          const tbody2 =
            "body > div > div.panel.panel-primary > div.list-group-item > div:nth-child(2) > div > div > table > tbody";
          await page.waitForSelector(tbody2, { timeout: 10000 });
          const rows2 = await page.$$(tbody2 + " > tr");
          if (rows2.length > 0) {
            deuda = await page.evaluate(
              (row) =>
                Array.from(
                  row.querySelectorAll("td"),
                  (cel: Element) => cel.textContent?.trim() || ""
                ),
              rows2[rows2.length - 1]
            );
          }
        }
      }

      // --- REPRESENTANTES LEGALES (INSERTADO) ---
      // Extrae la lista de representantes y la guarda en un array para devolverla.
      let representantes: string[][] = [];
      try {
        // retrocedeSel ya está definido arriba; intentamos volver si existe
        const retrocedeBtn3 = await page.$(retrocedeSel);
        if (retrocedeBtn3) {
          try {
            await Promise.all([
              retrocedeBtn3.click(),
              page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 10000 }),
            ]);
          } catch (err) {
            // ignore navigation errors aquí
          }
        }
        await delay(2000);

        const boton3Selector =
          "body > div > div.row > div > div:nth-child(5) > div:nth-child(5) > div:nth-child(3) > form > button";
        const boton3Elem = await page.$(boton3Selector);
        if (boton3Elem) {
          await boton3Elem.click();
          await delay(2000);

          const tbody3Selector =
            "body > div > div.panel.panel-primary > div.list-group-item > div:nth-child(2) > div > div > table > tbody";
          await page.waitForSelector(tbody3Selector, { timeout: 10000 }).catch(() => {});
          const rowsTable3 = await page.$$(tbody3Selector + " > tr");
          if (rowsTable3.length > 0) {
            for (let row of rowsTable3) {
              const tds = await page.evaluate((r) => {
                const cells = r.querySelectorAll("td");
                return Array.from(cells, (cell) => cell.textContent?.trim() || "");
              }, row);
              // Si la fila contiene al menos 5 columnas relevantes, la guardamos.
              if (tds.length >= 5) {
                representantes.push([identificacion, tds[0], tds[1], tds[2], tds[3], tds[4]]);
              }
            }
          }
        }
      } catch (e) {
        // No interrumpimos el flujo si no se puede extraer representantes, dejamos el array vacío.
      }
      // --- FIN REPRESENTANTES LEGALES (INSERTADO) ---

      //REPRESENTANTES LEGALES

      await browser.close();
      return {
        dataPrincipal: datos,
        cantidadTrabajadores: trabajadores,
        deudaCoactiva: deuda,
        representantesLegales: representantes, // <-- agregado al retorno
      };
    } catch (err) {
      retries++;
      await browser.close().catch(() => {});
      if (retries >= maxRetries)
        throw new Error(`Falló tras ${maxRetries} intentos`);
      ({ browser, page } = await initBrowser());
    } finally {
      await page
        .evaluate(() => {
          if (document.body) document.body.innerHTML = "";
        })
        .catch(() => {});
    }
  }

  await browser.close();
  throw new Error(`No se pudo extraer después de ${maxRetries} intentos.`);
}
