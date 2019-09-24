import { promises as fs } from "fs";
import path from "path";
import jsdom from "jsdom";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import getRuntimeScripts from "./getRuntimeScripts.mjs";
import jsx2html from "./jsx2html.mjs";

import tsconfig from "../tsconfig.json";

const { rootDir, outDir } = tsconfig.compilerOptions;

const INPUT_DIR = path.resolve(__dirname, "..", rootDir);
const OUTPUT_DIR = path.resolve(__dirname, "..", outDir);

Promise.all([
  jsdom.JSDOM.fromFile(path.join(INPUT_DIR, "index.html")),
  getRuntimeScripts(OUTPUT_DIR),
])
  .then(([dom, runTimeScripts]) => {
    const { window } = dom;
    const { document } = window;

    document.head.append(
      ...runTimeScripts.map(relativePath => {
        const scriptTag = document.createElement("script");
        scriptTag.type = "module";
        scriptTag.src = relativePath;
        return scriptTag;
      })
    );

    return jsx2html(window, path.join(OUTPUT_DIR, "index.js")).then(
      console.log
    );
    return dom.serialize();
  })
  .then(html => fs.writeFile(path.join(OUTPUT_DIR, "index.html"), html))
  .then(() => console.log("index.html rewriten"))
  .catch(console.error);
