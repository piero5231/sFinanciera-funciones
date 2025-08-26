import puppeteer from "puppeteer";

export async function scrapingMtc(ruc: string): Promise<any> {
  const urlMTC =
    "https://www.mtc.gob.pe/tramitesenlinea/tweb_tLinea/tw_consultadgtt/Frm_rep_intra_mercancia.aspx";

  if (!ruc || !/^\d{11}$/.test(ruc)) {
    console.error("Error: RUC inválido");
    return {
      estado: "ERROR",
      ruc,
    };
  }

  let browser: any = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const placasUnicas = new Set<string>();
    const registrosUnicos: any[] = [];

    await page.goto(urlMTC, { waitUntil: "networkidle2" });
    await page.waitForSelector("#txtValor", { timeout: 10000 });
    await page.type("#txtValor", ruc);

    await Promise.all([
      page.click("#btnBuscar"),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);

    try {
      await page.waitForSelector("#lblHtml table a", { timeout: 5000 });
    } catch (error) {
      console.log(`No se encontraron datos para el RUC: ${ruc}`);
      return {
        estado: "NO_DATOS",
        ruc,
        mensaje: "No se encontraron registros en el MTC",
      };
    }

    // CORRECCIÓN: Tipado explícito para links
    const enlaces = await page.$$eval("#lblHtml table a", (links: Element[]) =>
      links.map((link: Element) => {
        if (link instanceof HTMLAnchorElement) {
          return link.href;
        }
        return link.getAttribute("onclick") || "";
      })
    );

    for (let i = 0; i < enlaces.length; i++) {
      await page.evaluate((index: number) => {
        const elements = document.querySelectorAll("#lblHtml table a");
        if (elements[index]) {
          (elements[index] as HTMLElement).click();
        }
      }, i);

      await page.waitForNavigation({ waitUntil: "networkidle2" });

      const data = await page.$$eval("tr.textDisplay", (rows: Element[]) =>
        rows.slice(0, 1000).map((row: Element) => {
          const columns = row.querySelectorAll("td");
          const campos = [
            "item",
            "placa",
            "constancia",
            "categoria",
            "serieChasis",
            "anioFabricacion",
            "ejes",
            "cargaUtil",
            "pesoSeco",
          ];

          const registro: Record<string, string> = {};
          campos.forEach((campo, index) => {
            const valor = columns[index]?.textContent?.trim();
            if (valor) {
              registro[campo] = valor;
            }
          });

          return registro;
        })
      );

      for (const registro of data) {
        if (Object.keys(registro).length > 0) {
          if (registro.placa) {
            if (!placasUnicas.has(registro.placa)) {
              placasUnicas.add(registro.placa);
              registrosUnicos.push(registro);
            }
          } else {
            registrosUnicos.push(registro);
          }
        }
      }

      await page.goBack({ waitUntil: "networkidle2" });
      await page.waitForSelector("#lblHtml table a", { timeout: 5000 });
    }

    return registrosUnicos;
  } catch (error: any) {
    console.error(`Error durante el scraping: ${error.message}`);

    return {
      estado: "ERROR",
      mensaje: `Error durante el scraping: ${error.message}`,
    };
  } finally {
    if (browser) await browser.close();
  }
}

// if (require.main === module) {
//   const valor = process.argv[2];
//   if (!valor) {
//     console.error("Error: Debes proporcionar un RUC como argumento");
//     process.exit(1);
//   }
  
//   scrapingMtc(valor)
//     .then(resultado => {
//       console.log(JSON.stringify(resultado, null, 2));  
//       process.exit(0);
//     })
//     .catch(err => {
//       console.error("Error en la ejecución:", err);
//       process.exit(1);
//     });
// }
