import { promises as fs } from "fs";

import { BUNDLE_NAME, PORT_NUMBER } from "./dev-config.mjs";
import generateJS from "./prod-build-js.mjs";
import minifyCSS from "./prod-build-css.mjs";
import minifyInlinedSVG from "./prod-build-svg.mjs";
import { INPUT_HTML_FILE, OUTPUT_HTML_FILE } from "./prod-config.mjs";

if ("function" !== String.prototype.replaceAll) {
  String.prototype.replaceAll = function replaceAll(needle, replacementText) {
    const reg = new RegExp(needle, "g");
    return this.replace(reg, replacementText);
  };
}

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
    const iconNames = new Set(iconElements.map((el) => el.dataset.icon));
    const wrapperSVG = document.createDocumentFragment();

    let i = 0;
    for (const iconName of iconNames) {
      const thisIconElements = iconElements.filter(
        (el) => el.dataset.icon === iconName
      );
      // If the icon is only once in the document, don't bother
      if (thisIconElements.length > 1) {
        const [originalIconElement] = thisIconElements;
        const symbol = document.createElementNS(SVG_NS, "symbol");
        symbol.id = `fa${i++}`;
        replicateAttributes(originalIconElement, symbol, ["role", "viewBox"]);
        symbol.append(originalIconElement.firstElementChild);
        wrapperSVG.append(symbol);

        // replacing all instances of the icon with a reference to the symbol
        thisIconElements.forEach((el) => {
          const wrapperSVG = document.createElementNS(SVG_NS, "svg");
          const symbolCallback = document.createElementNS(SVG_NS, "use");
          symbolCallback.setAttribute("href", `#${symbol.id}`);
          replicateAttributes(el, wrapperSVG, ["class"]);
          wrapperSVG.append(symbolCallback);
          wrapperSVG.setAttribute("aria-hidden", "true");
          el.replaceWith(wrapperSVG);
        });
      } else {
        const [svg] = thisIconElements;
        for (const key in svg.dataset) {
          delete svg.dataset[key];
        }
      }
    }
    document.querySelector("svg").prepend(wrapperSVG);
  };

  return import(bundleURL)
    .then((module) => module.default)
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
        ),
        Array.from(
          new Set(
            Array.from(document.querySelectorAll("[class]")).flatMap((el) =>
              Array.from(el.classList)
            )
          )
        )
      )
    )
    .then((css) => {
      const style = document.createElement("style");
      style.textContent = css;
      document.head.append(style);
      Array.from(document.head.childNodes)
        .concat(Array.from(document.body.childNodes))
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .forEach((n) => n.remove());
    });
}

export default async function generateBundledHTML(browser) {
  console.log("Building HTML file...");
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (
      req.isNavigationRequest() ||
      new URL(req.url()).pathname === `/${BUNDLE_NAME}`
    ) {
      req.continue();
    } else {
      // Let's disable external resources to be sure the HTML doesn't get changed.
      // Also it speeds up the build process.
      req.abort();
    }
  });
  await page.goto(`http://localhost:${PORT_NUMBER}/${INPUT_HTML_FILE}`);

  await page.evaluate((env) => (window.process = { env }), process.env);
  await page.exposeFunction("minifyCSS", minifyCSS);

  await page.evaluate(domManipulationsRoutine, `/${BUNDLE_NAME}`);

  const html = await page.content().then(minifyInlinedSVG);

  const jsCode = await Promise.all([import("terser"), generateJS()]).then(
    ([terser, jsChunks]) => {
      const { error, code } = terser.default.minify(
        jsChunks.output.map(({ code }) => code).join(";"),
        { toplevel: true }
      );

      return error ? Promise.reject(error) : code;
    }
  );

  return fs.writeFile(
    OUTPUT_HTML_FILE,
    html
      .replaceAll("svg-inline--fa", "f")
      .replace(
        "</body></html>",
        `<script type="module">${jsCode}</script></body></html>`
      )
  );
}
