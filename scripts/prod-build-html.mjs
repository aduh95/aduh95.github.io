import { promises as fs } from "fs";
import { createRequire } from "module";

import puppeteer from "puppeteer";
import purifycss from "purify-css";
import terser from "terser";

import { startServer } from "./dev-server.mjs";
import { BUNDLE_NAME, PORT_NUMBER } from "./dev-config.mjs";
import generateJS from "./prod-build-js.mjs";

startServer()
  .then(() => puppeteer.launch())
  .then(async browser => {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT_NUMBER}/originalIndexFile`);

    await page.evaluate(env => (window.process = { env }), process.env);
    await page.exposeFunction("purifycss", (html, css) =>
      purifycss(html, css, {
        minify: true,
        info: true,
        rejected: false,
      }).replace(/\n/g, "")
    );

    const html = await page.evaluate(function(bundleURL) {
      return import(bundleURL)
        .then(module => module.default)
        .then(() =>
          purifycss(
            document.documentElement.outerHTML,
            Array.from(document.head.querySelectorAll("style")).reduce(
              (pv, style) => {
                pv += style.textContent;
                style.remove();
                return pv;
              },
              ""
            )
          )
        )
        .then(css => {
          const style = document.createElement("style");
          style.textContent = css;
          document.head.append(style);
          Array.from(document.head.childNodes)
            .concat(Array.from(document.body.childNodes))
            .filter(n => n.nodeType === Node.TEXT_NODE)
            .forEach(n => n.remove());

          Array.from(document.querySelectorAll("svg.svg-inline--fa")).forEach(
            ({ classList }) => {
              let className,
                item = 0;
              while ((className = classList.item(item))) {
                if (className.endsWith("-undefined")) {
                  classList.remove(className);
                } else {
                  item++;
                }
              }
            }
          );
          return document.documentElement.outerHTML;
        });
    }, `/${BUNDLE_NAME}`);

    await browser.close();

    return generateJS()
      .then(chunks => {
        let jsCode = "";
        jsCode +=
          "(function(){var n={};define=function(i,o,c){c.apply(this,o.map(function() {return n}))}})();";
        for (const { code } of chunks.output) {
          jsCode += code;
        }
        return jsCode;
      })
      .then(jsCode => terser.minify(jsCode, { toplevel: true }))
      .then(result => (result.error ? Promise.reject(error) : result.code))
      .then(
        jsCode =>
          "<!DOCTYPE html>\n" +
          html.replace(
            "</body></html>",
            `<script>${jsCode}</script></body></html>`
          )
      );
  })
  .then(html => fs.writeFile("index.html", html))
  .catch(console.error)
  .finally(() => process.exit());
