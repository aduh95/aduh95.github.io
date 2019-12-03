import { promises as fs } from "fs";

import puppeteer from "puppeteer";
import postcss from "postcss";
import cssnano from "cssnano";
import terser from "terser";

import { startServer } from "./dev-server.mjs";
import { BUNDLE_NAME, PORT_NUMBER } from "./dev-config.mjs";
import generateJS from "./prod-build-js.mjs";
import minifyInlinedSVG from "./prod-build-svg.mjs";

const OUTPUT_FILE = "index.html";

const postCSSProcessor = postcss([
  cssnano({
    preset: [
      "default",
      {
        discardComments: {
          removeAll: true,
        },
      },
    ],
  }),
]);

function domManipulationsRoutine(bundleURL) {
  const SVG_NS = "http://www.w3.org/2000/svg";

  const replicateAttributes = (originalNode, targetNode, attributeNames) => {
    for (const attr of attributeNames) {
      targetNode.setAttribute(attr, originalNode.getAttribute(attr));
    }
  };

  const minifySVGIcons = () => {
    const iconElements = Array.from(
      document.querySelectorAll("svg.svg-inline--fa")
    );
    iconElements.forEach(({ classList }) => {
      // Remove undefined class names from SVG elements
      let className,
        item = 0;
      while ((className = classList.item(item))) {
        if (className.endsWith("-undefined")) {
          classList.remove(className);
        } else {
          // The entry has been kept in the list, iterating to the next one
          item++;
        }
      }
    });
    const iconNames = new Set(iconElements.map(el => el.dataset.icon));
    const wrapperSVG = document.createElementNS(SVG_NS, "svg");
    wrapperSVG.style.display = "none";
    let i = 0;
    for (const iconName of iconNames) {
      const thisIconElements = iconElements.filter(
        el => el.dataset.icon === iconName
      );
      // If the icon is only once in the document, don't bother
      if (thisIconElements.length > 1) {
        const [originalIconElement] = thisIconElements;
        const symbol = document.createElementNS(SVG_NS, "symbol");
        symbol.setAttribute("aria-hidden", "true");
        symbol.id = `fa${i++}`;
        replicateAttributes(originalIconElement, symbol, ["role", "viewBox"]);
        symbol.append(originalIconElement.firstElementChild);
        wrapperSVG.append(symbol);

        // replacing all instances of the icon with a reference to the symbol
        thisIconElements.forEach(el => {
          const wrapperSVG = document.createElementNS(SVG_NS, "svg");
          const symbolCallback = document.createElementNS(SVG_NS, "use");
          symbolCallback.setAttribute("href", `#${symbol.id}`);
          replicateAttributes(el, wrapperSVG, ["class"]);
          wrapperSVG.append(symbolCallback);
          el.replaceWith(wrapperSVG);
        });
      }
    }
    document.body.prepend(wrapperSVG);
  };

  return import(bundleURL)
    .then(module => module.default)
    .then(minifySVGIcons)
    .then(() =>
      minifyCSS(
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
    });
}

const getGeneratedFileSize = () =>
  fs.stat(OUTPUT_FILE).then(stats => stats.size);

const generateBundledHTML = async browser => {
  const page = await browser.newPage();
  await page.goto(`http://localhost:${PORT_NUMBER}/originalIndexFile`);

  await page.evaluate(env => (window.process = { env }), process.env);
  await page.exposeFunction("minifyCSS", css =>
    postCSSProcessor
      .process(css, { from: undefined, map: { annotation: false } })
      .then(result => result.css)
  );

  await page.evaluate(domManipulationsRoutine, `/${BUNDLE_NAME}`);

  const html = await page.content().then(minifyInlinedSVG);

  await browser.close();

  return generateJS()
    .then(chunks => chunks.output.map(({ code }) => code).join(";"))
    .then(jsCode => terser.minify(jsCode, { toplevel: true }))
    .then(({ error, code }) => (error ? Promise.reject(error) : code))
    .then(jsCode =>
      html.replace(
        "</body></html>",
        `<script type="module">${jsCode}</script></body></html>`
      )
    );
};

Promise.all([getGeneratedFileSize(), startServer()])
  .then(([previousFileSize, server]) =>
    puppeteer
      .launch()
      .then(generateBundledHTML)
      .then(html => fs.writeFile(OUTPUT_FILE, html))
      .finally(() => server.close())
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
