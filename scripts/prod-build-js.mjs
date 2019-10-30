import typescript from "rollup-plugin-typescript2";
import _rollup from "rollup";

import getRuntimeScripts from "./getRuntimeScripts.mjs";

const plugins = [bundleRuntimeScripts(), typescript()];

function bundleRuntimeScripts() {
  return {
    name: "bundle-runtime-scripts",
    resolveId(source) {
      // this signals that rollup should not ask other plugins or check the file system to find this id
      return source === "virtual-module" ? source : null;
    },
    load(id) {
      if (id === "virtual-module") {
        return getRuntimeScripts().then(scripts =>
          scripts.map(([_, path]) => `import "${path}"`).join(";")
        );
      }
      return null; // other ids should be handled as usually
    },
  };
}

export default () =>
  _rollup
    .rollup({
      input: "virtual-module",
      plugins,
    })
    .then(bundle => bundle.generate({ sourcemap: false, format: "iife" }));
