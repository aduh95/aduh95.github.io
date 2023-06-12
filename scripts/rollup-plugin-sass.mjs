import { fileURLToPath, pathToFileURL } from "node:url";
import * as sass from "sass";

const PLUGIN_HELPER = "sass-plugin:createStyleElement";

function createStyleElement(css, id) {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.append(style);
  style.dataset.file = id;
  return style;
}

export default function plugin() {
  return {
    name: "sass",
    resolveId(specifier, importer) {
      if (specifier === PLUGIN_HELPER) return PLUGIN_HELPER;
    },
    load(id) {
      if (id === PLUGIN_HELPER) {
        return `export default ${createStyleElement};`;
      } else if (id.endsWith(".scss")) {
        const { css, sourceMap } = sass.compile(id, { sourceMap: true });

        // Don't send useless info to browser
        delete sourceMap.sourcesContent;

        return `import helper from "${PLUGIN_HELPER}";export default helper(${JSON.stringify(
          css +
            "\n/*# sourceMappingURL=data:application/json," +
            encodeURI(JSON.stringify(sourceMap)) +
            " */"
        )},${JSON.stringify(id)})`;
      }
    },
  };
}
