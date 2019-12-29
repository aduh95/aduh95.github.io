import { PORT_NUMBER } from "./dev-config.mjs";
import {
  OUTPUT_PDF_FILE_PREFIX,
  OUTPUT_PDF_LANGUAGES,
  OUTPUT_HTML_FILE,
} from "./prod-config.mjs";

export default browser =>
  Promise.all(
    OUTPUT_PDF_LANGUAGES.map(lang =>
      browser.newPage().then(async page => {
        console.log(`Building PDF file with locale ${lang}...`);
        await page.goto(
          `http://localhost:${PORT_NUMBER}/${OUTPUT_HTML_FILE}#${lang}`
        );

        await page.pdf({
          path: `dist/${OUTPUT_PDF_FILE_PREFIX}-${lang}.pdf`,
          printBackground: true,
          preferCSSPageSize: true,
        });

        return page.close();
      })
    )
  );
