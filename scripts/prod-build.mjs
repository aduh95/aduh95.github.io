import { promises as fs } from "fs";
import puppeteer from "puppeteer";

import { startServer } from "./dev-server.mjs";
import generateBundledHTML from "./prod-build-html.mjs";
import generatePDFFiles from "./prod-build-pdf.mjs";

import { OUTPUT_HTML_FILE } from "./prod-config.mjs";

const getGeneratedFileSize = () =>
  fs.stat(OUTPUT_HTML_FILE).then(stats => stats.size);

Promise.all([getGeneratedFileSize(), startServer()])
  .then(([previousFileSize, server]) =>
    puppeteer
      .launch()
      .then(browser =>
        generateBundledHTML(browser)
          .then(() => generatePDFFiles(browser))
          .finally(() => {
            browser.close();
            server.close();
          })
      )

      .then(getGeneratedFileSize)
      .then(
        newFileSize =>
          `New file is ${newFileSize - previousFileSize} bytes bigger.`
      )
  )
  .then(console.log)
  .catch(e => {
    console.error(e);
    process.exitCode = 1;
  });
