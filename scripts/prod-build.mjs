import { promises as fs } from "fs";
import puppeteer from "puppeteer";

import { startServer } from "./dev-server.mjs";
import generateBundledHTML from "./prod-build-html.mjs";
import generatePDFFiles from "./prod-build-pdf.mjs";

import { OUTPUT_HTML_FILE } from "./prod-config.mjs";

process.env.NODE_ENV = "production";

const getGeneratedFileSize = () =>
  fs
    .stat(OUTPUT_HTML_FILE)
    .then((stats) => stats.size)
    .catch((e) => 0);

Promise.all([getGeneratedFileSize(), startServer()])
  .then(([previousFileSize, closeServer]) =>
    puppeteer
      .launch({
        headless: 'new'
      })
      .then((browser) =>
        generateBundledHTML(browser)
          .then(() => generatePDFFiles(browser))
          .finally(() =>
            Promise.all([browser.close(), closeServer()]).then(() =>
              console.log("Server stopped.")
            )
          )
      )

      .then(getGeneratedFileSize)
      .then(
        (newFileSize) =>
          `\n=> HTML file is ${newFileSize - previousFileSize} bytes bigger.\n`
      )
  )
  .then(console.log)
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
