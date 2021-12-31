import typescript from "@rollup/plugin-sucrase";
import { rollup } from "rollup";

import tsConfig from "../tsconfig.json" assert { type: "json" };
import getRuntimeModules from "./runtime-modules.mjs";

const plugins = [
  bundleRuntimeScripts(),
  typescript({
    jsxFragmentPragma: tsConfig.compilerOptions.jsxFragmentFactory,
    jsxPragma: tsConfig.compilerOptions.jsxFactory,
    transforms: ["jsx", "typescript"],
    disableESTransforms: true,
    include: ["**.tsx", "**.ts"],
    production: true,
    sourceMap: false,
  }),
];

function bundleRuntimeScripts() {
  return {
    name: "bundle-runtime-scripts",
    resolveId(source) {
      // this signals that rollup should not ask other plugins or check the file system to find this id
      return source === "runtime-modules" ? source : null;
    },
    load(id) {
      if (id === "runtime-modules") {
        return getRuntimeModules().then((scripts) =>
          scripts.map(([_, path]) => `import ${JSON.stringify(path)}`).join(";")
        );
      }
      return null; // other ids should be handled as usually
    },
  };
}

export default () =>
  rollup({
    input: "runtime-modules",
    plugins,
  }).then((bundle) => bundle.generate({ sourcemap: false, format: "module" }));
